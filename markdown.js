/**
 * markdown.js - Bộ tiền xử lý và render Markdown phong cách Notion tối ưu cho FlowHub
 * Dựa trên kiến trúc chuẩn của repo JapaneseLearningAssistant
 */

(function () {
  'use strict';

  function setupMarked() {
    if (typeof window.marked !== 'undefined' && typeof window.marked.setOptions === 'function') {
      try {
        window.marked.setOptions({
          gfm: true,
          breaks: true,
          pedantic: false
        });
      } catch (e) {
        console.warn('Không thể cấu hình marked.setOptions:', e);
      }
    }
  }

  setupMarked();

  /**
   * Làm sạch và chuẩn hóa văn bản Markdown trước khi đưa vào parser
   */
  function cleanMarkdownText(rawText) {
    if (!rawText || typeof rawText !== 'string') return '';

    let text = rawText.trim();

    // 1. Gỡ bỏ khối code bọc ngoài cùng nếu lỡ có ```markdown ... ``` hoặc ``` ... ```
    const outerFenceMatch = text.match(/^```(?:markdown|md)?\s*[\r\n]+([\s\S]*?)[\r\n]+```\s*$/i);
    if (outerFenceMatch) {
      text = outerFenceMatch[1].trim();
    } else {
      if (text.startsWith('```markdown\n') || text.startsWith('```markdown\r\n')) {
        text = text.replace(/^```markdown[\r\n]+/, '');
      } else if (text.startsWith('```\n') || text.startsWith('```\r\n')) {
        text = text.replace(/^```[\r\n]+/, '');
      }
      if (text.endsWith('\n```') || text.endsWith('\r\n```')) {
        text = text.replace(/[\r\n]+```$/, '');
      }
    }

    // 2. Gỡ bỏ khoảng trắng thụt lề đầu dòng (2+ khoảng trắng hoặc tab) trước các tiêu đề (#, ##, ###)
    text = text.replace(/^[ \t]{2,}(#{1,6}\s)/gm, '$1');

    // 3. Gỡ bỏ khoảng trắng thụt lề đầu dòng trước bảng Markdown (|)
    text = text.replace(/^[ \t]{2,}(\|)/gm, '$1');

    // 4. Chuẩn hóa thụt lề cho danh sách không biến thành code block
    text = text.replace(/^[ \t]{4,}([-*+]\s|\d+\.\s)/gm, '  $1');

    // 5. Khử sạch toàn bộ ký hiệu LaTeX thành ký tự Unicode chuẩn
    text = text
      .replace(/\\rightarrow|\$+\s*\\rightarrow\s*\$+|\\to|\$+\s*\\to\s*\$+/gi, '→')
      .replace(/\\Rightarrow|\$+\s*\\Rightarrow\s*\$+|\\implies|\$+\s*\\implies\s*\$+/gi, '⇒')
      .replace(/\\leftarrow|\$+\s*\\leftarrow\s*\$+/gi, '←')
      .replace(/\\Leftarrow|\$+\s*\\Leftarrow\s*\$+/gi, '⇐')
      .replace(/\\leftrightarrow|\$+\s*\\leftrightarrow\s*\$+/gi, '↔')
      .replace(/\\Leftrightarrow|\$+\s*\\Leftrightarrow\s*\$+|\\iff|\$+\s*\\iff\s*\$+/gi, '⇔')
      .replace(/\\uparrow|\$+\s*\\uparrow\s*\$+/gi, '↑')
      .replace(/\\downarrow|\$+\s*\\downarrow\s*\$+/gi, '↓')
      .replace(/\\dots|\\cdots|\\ldots|\$+\s*\\(?:dots|cdots|ldots)\s*\$+/gi, '...')
      .replace(/\\times|\$+\s*\\times\s*\$+/gi, '×')
      .replace(/\\div|\$+\s*\\div\s*\$+/gi, '÷')
      .replace(/\\approx|\$+\s*\\approx\s*\$+/gi, '≈')
      .replace(/\\neq|\$+\s*\\neq\s*\$+/gi, '≠')
      .replace(/\\le(q)?|\$+\s*\\le(q)?\s*\$+/gi, '≤')
      .replace(/\\ge(q)?|\$+\s*\\ge(q)?\s*\$+/gi, '≥')
      .replace(/\\pm|\$+\s*\\pm\s*\$+/gi, '±')
      .replace(/\\bullet|\$+\s*\\bullet\s*\$+/gi, '•')
      .replace(/\\sim|\$+\s*\\sim\s*\$+/gi, '~')
      .replace(/\$([^$]+)\$/g, (m, inner) => inner.replace(/\\rightarrow|\\to/gi, '→').replace(/\\Rightarrow/gi, '⇒').trim());

    // 6. Chuẩn hóa todo [ ] / [x]
    text = text
      .replace(/(^|\n)\s*\[ \]\s*/g, '$1- [ ] ')
      .replace(/(^|\n)\s*\[[xX]\]\s*/g, '$1- [x] ');

    return text;
  }

  /**
   * Bộ Parser dự phòng cơ bản nếu Marked.js bị lỗi hoặc chưa tải kịp
   */
  function fallbackParse(text) {
    const lines = text.split(/\r?\n/);
    const htmlParts = [];
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    let inList = false;

    function flushTable() {
      if (!inTable) return;
      let html = '<div class="notion-table-container table-responsive"><table class="notion-table nihon-table"><thead><tr>';
      tableHeaders.forEach(th => {
        html += '<th>' + formatInline(th) + '</th>';
      });
      html += '</tr></thead><tbody>';
      tableRows.forEach(row => {
        html += '<tr>';
        row.forEach(td => {
          html += '<td>' + formatInline(td) + '</td>';
        });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      htmlParts.push(html);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    function flushList() {
      if (!inList) return;
      htmlParts.push('</ul>');
      inList = false;
    }

    function formatInline(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g, '<span class="notion-timestamp">[$1]</span>')
        .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/~~([^~]+)~~/g, '<s>$1</s>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Kiểm tra dòng bảng
      if (line.startsWith('|') && line.endsWith('|')) {
        flushList();
        const cells = line.slice(1, -1).split('|').map(c => c.trim());
        const isSeparator = cells.every(c => /^:?-+:?$/.test(c));

        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else if (isSeparator) {
          // Bỏ qua dòng phân cách |---|---|
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Kiểm tra danh sách todo
      if (/^-\s*\[([ xX])\]\s+/.test(line)) {
        flushList();
        const isDone = /\[[xX]\]/.test(line);
        const todoText = line.replace(/^-\s*\[[ xX]\]\s+/, '');
        htmlParts.push(
          '<div class="notion-todo-row' + (isDone ? ' done' : '') + '">' +
          '<input type="checkbox" class="notion-todo-checkbox"' + (isDone ? ' checked' : '') + '>' +
          '<div class="notion-todo-text">' + formatInline(todoText) + '</div></div>'
        );
        continue;
      }

      // Kiểm tra danh sách gạch đầu dòng
      if (/^[-*+]\s+/.test(line)) {
        if (!inList) {
          inList = true;
          htmlParts.push('<ul>');
        }
        htmlParts.push('<li>' + formatInline(line.replace(/^[-*+]\s+/, '')) + '</li>');
        continue;
      } else if (inList) {
        flushList();
      }

      // Tiêu đề
      if (/^#{1,6}\s+/.test(line)) {
        const level = line.match(/^(#{1,6})\s+/)[1].length;
        const headingText = line.replace(/^#{1,6}\s+/, '');
        htmlParts.push('<h' + level + '>' + formatInline(headingText) + '</h' + level + '>');
        continue;
      }

      // Dòng kẻ ngang
      if (/^(?:---|\*\*\*|___)$/.test(line)) {
        htmlParts.push('<hr>');
        continue;
      }

      // Dòng trống
      if (line === '') {
        continue;
      }

      // Đoạn văn thông thường
      htmlParts.push('<p>' + formatInline(line) + '</p>');
    }

    flushTable();
    flushList();

    return htmlParts.join('\n');
  }

  /**
   * Hậu xử lý HTML sau khi Marked render
   * - Bọc table trong .notion-table-container .table-responsive
   * - Xử lý khối Callout (> [!TIP], > [!NOTE], ...)
   * - Xử lý khối Code wrapper kèm nút Copy
   * - Chuyển đổi checklist items sang .notion-todo-row
   * - Chuyển đổi mốc thời gian [MM:SS] sang badge
   */
  function postProcessHtml(html) {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // 1. Tables: Bọc trong .notion-table-container .table-responsive
    const tables = temp.querySelectorAll('table');
    tables.forEach(table => {
      table.classList.add('notion-table');
      table.classList.add('nihon-table');

      if (!table.parentElement || !table.parentElement.classList.contains('notion-table-container')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'notion-table-container table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // 2. Callouts: Xử lý blockquotes chứa cú pháp [!TIP], [!NOTE], [!IMPORTANT], ...
    const blockquotes = temp.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
      const firstP = bq.querySelector('p') || bq;
      const match = (firstP.textContent || '').match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|INFO)\]\s*(.*)$/im);
      if (match) {
        const type = match[1].toLowerCase();
        const titleMap = {
          note: { icon: 'ℹ️', title: 'Ghi chú' },
          tip: { icon: '💡', title: 'Mẹo hay' },
          important: { icon: '⚠️', title: 'Quan trọng' },
          warning: { icon: '⚠️', title: 'Cảnh báo' },
          info: { icon: 'ℹ️', title: 'Thông tin' }
        };
        const meta = titleMap[type] || { icon: '📌', title: type.toUpperCase() };

        // Lấy nội dung sau khi bỏ [!TYPE]
        let rawHtml = bq.innerHTML;
        rawHtml = rawHtml.replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|INFO)\]/i, '').trim();

        const callout = document.createElement('div');
        callout.className = 'notion-callout ' + type;
        callout.innerHTML =
          '<div class="callout-header">' +
          '<span class="callout-icon">' + meta.icon + '</span>' +
          '<span class="callout-title">' + meta.title + '</span>' +
          '</div>' +
          '<div class="callout-content">' + rawHtml + '</div>';

        bq.replaceWith(callout);
      }
    });

    // 3. Code blocks: Bọc trong .notion-code-wrapper với header và nút Sao chép
    const pres = temp.querySelectorAll('pre');
    pres.forEach(pre => {
      // Tránh lồng nhiều lần
      if (pre.parentElement && pre.parentElement.classList.contains('notion-code-wrapper')) return;

      const codeEl = pre.querySelector('code');
      const langMatch = codeEl ? (codeEl.className || '').match(/language-([a-zA-Z0-9_-]+)/) : null;
      const lang = langMatch ? langMatch[1] : 'code';
      const codeText = codeEl ? codeEl.textContent : pre.textContent;

      const wrapper = document.createElement('div');
      wrapper.className = 'notion-code-wrapper';
      wrapper.innerHTML =
        '<div class="notion-code-header">' +
        '<span class="notion-code-lang">' + lang + '</span>' +
        '<button type="button" class="notion-copy-code-btn" data-code="' + encodeURIComponent(codeText.trim()) + '">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
        '<span>Sao chép</span>' +
        '</button>' +
        '</div>';

      pre.parentNode.insertBefore(wrapper, pre);
      pre.classList.add('notion-pre');
      wrapper.appendChild(pre);
    });

    // 4. Checklist items: Chuyển đổi checkbox sang .notion-todo-row
    const lis = temp.querySelectorAll('li');
    lis.forEach(li => {
      const chk = li.querySelector('input[type="checkbox"]');
      if (chk) {
        const isChecked = chk.checked || chk.hasAttribute('checked');
        chk.remove();
        const text = li.innerHTML.trim();

        const row = document.createElement('div');
        row.className = 'notion-todo-row' + (isChecked ? ' done' : '');
        row.innerHTML =
          '<input type="checkbox" class="notion-todo-checkbox"' + (isChecked ? ' checked' : '') + '>' +
          '<div class="notion-todo-text">' + text + '</div>';

        li.replaceWith(row);
      }
    });

    // Unwrap todo rows from parent <ul> nếu toàn bộ là todo
    temp.querySelectorAll('ul').forEach(ul => {
      const rows = ul.querySelectorAll(':scope > .notion-todo-row');
      if (rows.length > 0 && ul.children.length === rows.length) {
        rows.forEach(r => ul.before(r));
        ul.remove();
      }
    });

    // 5. Timestamps: Tìm mốc thời gian [MM:SS] hoặc [HH:MM:SS] để bọc badge
    const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (parent && !/code|pre|script|style/i.test(parent.tagName) && !parent.classList.contains('notion-code-lang')) {
        textNodes.push(walker.currentNode);
      }
    }
    textNodes.forEach(node => {
      if (/\[\d{1,2}:\d{2}(?::\d{2})?\]/.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g, '<span class="notion-timestamp">[$1]</span>');
        node.replaceWith(span);
      }
    });

    // 6. Links: Luôn mở tab mới an toàn
    const links = temp.querySelectorAll('a');
    links.forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    return temp.innerHTML;
  }

  const MarkdownRenderer = {
    render(rawText) {
      if (!rawText) return '';

      setupMarked();
      const cleanText = cleanMarkdownText(rawText);

      let rawHtml = '';

      if (typeof window.marked !== 'undefined') {
        try {
          if (typeof window.marked.parse === 'function') {
            rawHtml = window.marked.parse(cleanText);
          } else if (typeof window.marked === 'function') {
            rawHtml = window.marked(cleanText);
          }
        } catch (err) {
          console.error('Lỗi khi Marked parse Markdown:', err);
          rawHtml = fallbackParse(cleanText);
        }
      } else {
        rawHtml = fallbackParse(cleanText);
      }

      if (!rawHtml) {
        rawHtml = fallbackParse(cleanText);
      }

      return postProcessHtml(rawHtml);
    },

    cleanText(rawText) {
      return cleanMarkdownText(rawText);
    }
  };

  window.MarkdownRenderer = MarkdownRenderer;
})();
