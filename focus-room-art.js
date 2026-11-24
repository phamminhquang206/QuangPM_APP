
(function (root) {
    'use strict';

    const W = 1020, H = 600;
    const across = x => x * W / 900;
    // The floor's front-left edge in the widened room coordinates.
    const floorEdgeSlope = 175 / 531;
    const floorSideSlope = -139 / 341;
    const bedFloorInset = 14;
    const artPath = 'focus-room-assets/';
    const positions = {
        desk: [396, 382, 269, 170],
        chair: [327, 396, 127, 151],
        wall: [640, 192, 123, 105],
        shelf: [514, 350, 100, 131],
        sofa: [685, 453, 283, 171],
        bed: [195, 464, 307, 245],
        rug: [443, 485, 238, 113]
    };
    // Anchors on the painted desktop, from the viewer's left to right.
    const surfaces = {
        laptop: [356, 267, 74, 72],
        phone: [384, 281, 36, 22],
        console: [421, 270, 51, 30],
        lamp: [404, 249, 72, 104]
    };
    const deskX = across(positions.desk[0]);
    const deskFloor = positions.desk[1];
    const workScale = 0.8;
    const byDesk = x => deskX + (x - 355) * workScale;
    const byDeskFloor = y => deskFloor + (y - deskFloor) * workScale;
    const deskScale = 0.93 * workScale;
    const chairScale = 0.91 * workScale;
    const poses = {
        stand: [0, 231], walk: [13, 231], desk: [2, 205], type: [3, 205],
        floor: [4, 164], reach: [6, 231], stretch: [7, 245],
        phone: [10, 231], console: [11, 168],
        seated: [12, 205]
    };
    const walkFrames = [13, 14, 15, 16];
    const sofaWidths = [153, 232, 263, 292];
    const sofaScale = 1.15 * 0.95;
    const sofaActorScale = 1.10;
    const consoleActorScale = 0.80;
    const stretchMs = 1750;
    const breakRestMs = 3500;
    const breakDeviceMs = 6500;
    // Cushion contact point and occupant height for each sofa cutout.
    const sofaSeats = {
        'sofa-1': [0.38, 0.58, 184],
        'sofa-2': [0.38, 0.57, 196],
        'sofa-3': [0.49, 0.57, 196],
        'sofa-4': [0.59, 0.57, 196]
    };
    const sofaSpriteHip = [0.65, 0.51];
    const sofaSpriteFeet = [[0.19, 0.94], [0.51, 0.99]];
    // Pillow centers in the original cutouts, before the bed is mirrored.
    const pillows = {
        'bed-1': [0.76, 0.23],
        'bed-2': [0.75, 0.27],
        'bed-3': [0.75, 0.20],
        'bed-4': [0.76, 0.23]
    };
    // Near head, near foot and far foot where the unmirrored models meet the floor.
    const bedFeet = {
        'bed-1': [[0.963, 0.624], [0.381, 0.989], [0.055, 0.861]],
        'bed-2': [[0.961, 0.637], [0.408, 0.987], [0.065, 0.861]],
        'bed-3': [[0.983, 0.568], [0.423, 0.979], [0.043, 0.864]],
        'bed-4': [[0.951, 0.622], [0.429, 0.986], [0.071, 0.882]]
    };
    const ease = value => value * value * (3 - 2 * value);

    function loadImage(src) {
        const image = new Image();
        image.src = src;
        return image.decode().then(() => image);
    }

    const art = { frames: null, sheets: null, sleeper: null, sofaOccupant: null, breakDevices: {} };
    async function loadArt() {
        const response = await fetch(artPath + 'frames-v2.json');
        if (!response.ok) throw new Error('Focus Room art index could not be loaded.');
        const frames = await response.json();
        const [sheets, sleeper, sofaOccupant] = await Promise.all([
            Promise.all(frames.sheets.map(file => loadImage(artPath + file))),
            loadImage(artPath + 'sleeping-person.webp'),
            loadImage(artPath + 'sofa-seated-angled.webp')
        ]);
        art.frames = frames.sprites;
        art.sheets = sheets;
        art.sleeper = sleeper;
        art.sofaOccupant = sofaOccupant;
        await Promise.all(['phone', 'console'].map(async device => {
            try {
                art.breakDevices[device] = await loadImage(artPath + 'rest-sofa-' + device + '.webp');
            } catch (error) {
                console.warn(error);
            }
        }));
    }
    const assetsReady = loadArt().catch(error => console.warn(error));

    function contain(key, x, bottom, maxWidth, maxHeight) {
        const crop = art.frames?.[key];
        if (!crop) return null;
        const width = crop[3], height = crop[4];
        const scale = Math.min(maxWidth / width, maxHeight / height);
        return [x - width * scale / 2, bottom - height * scale, width * scale, height * scale];
    }

    function paint(c, key, rect, mirrored = false) {
        if (!rect) return;
        const [sheet, x, y, w, h] = art.frames[key];
        if (mirrored) {
            c.save();
            c.translate(rect[0] * 2 + rect[2], 0);
            c.scale(-1, 1);
        }
        c.drawImage(art.sheets[sheet], x, y, w, h, ...rect);
        if (mirrored) c.restore();
    }

    function bedProjection(id, rect) {
        if (!rect || !bedFeet[id]) return null;
        const [, , w, h] = rect;
        const [head, foot, far] = bedFeet[id].map(([u, v]) => [(1 - u) * w, v * h]);
        const side = (foot[1] - head[1]) / (foot[0] - head[0]);
        const end = (far[1] - foot[1]) / (far[0] - foot[0]);
        // Project both base rails onto the floor edges while keeping the bed posts upright.
        const vertical = (floorEdgeSlope - floorSideSlope) / (side - end);
        const shear = floorEdgeSlope - side * vertical;
        const x = 94 - head[0];
        const y = 425 + (94 - 69) * floorEdgeSlope - bedFloorInset - shear * head[0] - vertical * head[1];
        return {
            matrix: [1, shear, 0, vertical, x, y],
            at: (u, v) => [x + (1 - u) * w, y + shear * (1 - u) * w + vertical * v * h]
        };
    }

    function paintBed(c, id, rect, occupied) {
        const projection = bedProjection(id, rect);
        if (!projection) return;
        const [, , width, height] = rect;
        c.save();
        c.transform(...projection.matrix);
        paint(c, id, [0, 0, width, height], true);
        c.restore();
        if (!occupied || !art.sleeper) return;
        const [headX, headY] = projection.at(...pillows[id]);
        const w = width * 0.35;
        const h = w * art.sleeper.naturalHeight / art.sleeper.naturalWidth;
        c.save();
        c.translate(headX - w * 0.36, headY - h * 0.40);
        // Reveal the face and both arms, while the bed's own duvet hides the waist.
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(w, 0);
        c.lineTo(w, h * 0.34);
        c.quadraticCurveTo(w * 0.88, h * 0.42, w * 0.88, h * 0.63);
        c.quadraticCurveTo(w * 0.87, h * 0.77, w * 0.82, h);
        c.lineTo(0, h);
        c.closePath();
        c.clip();
        c.drawImage(art.sleeper, 0, 0, w, h);
        c.restore();
    }

    function sofaOccupantRect(id, rect, person = art.sofaOccupant) {
        if (!id || !rect || !person) return null;
        const [u, v, baseHeight] = sofaSeats[id];
        const height = baseHeight * sofaActorScale;
        const [x, y, w, h] = rect;
        const width = height * person.naturalWidth / person.naturalHeight;
        return [x + u * w - width * sofaSpriteHip[0], y + v * h - height * sofaSpriteHip[1], width, height];
    }

    function shadow(c, x, y, width, depth, opacity) {
        c.save();
        c.translate(x, y);
        c.scale(1, depth / width);
        const gradient = c.createRadialGradient(0, 0, width * 0.1, 0, 0, width);
        gradient.addColorStop(0, 'rgba(54,27,18,' + opacity + ')');
        gradient.addColorStop(1, 'rgba(54,27,18,0)');
        c.fillStyle = gradient;
        c.fillRect(-width, -width, width * 2, width * 2);
        c.restore();
    }

    function glow(c, x, y, amber) {
        c.save();
        c.translate(x, y);
        c.scale(1, 0.75);
        c.globalCompositeOperation = 'screen';
        const light = c.createRadialGradient(0, 0, 4, 0, 0, 89);
        light.addColorStop(0, amber ? '#ffbb5e74' : '#ffdea272');
        light.addColorStop(1, '#ffbe6500');
        c.fillStyle = light;
        c.fillRect(-89, -89, 178, 178);
        c.restore();
    }

    function thumbnail(canvas, item) {
        assetsReady.then(() => {
            if (!canvas.isConnected) return;
            const c = canvas.getContext('2d');
            c.clearRect(0, 0, canvas.width, canvas.height);
            const rect = contain(item.id, canvas.width / 2, 0, canvas.width - 40, canvas.height - 31);
            if (!rect) return;
            rect[1] = (canvas.height - rect[3]) / 2 - 2;
            shadow(c, canvas.width / 2, rect[1] + rect[3] + 1, rect[2] * 0.53, 9, 0.22);
            paint(c, item.id, rect);
        });
    }

    class Scene {
        constructor(element, onInteract) {
            this.canvas = element.querySelector('canvas');
            this.canvas.width = W * 2;
            this.canvas.height = H * 2;
            this.context = this.canvas.getContext('2d');
            this.hitLayer = element.querySelector('.room-hotspots');
            // Keep the artwork, objects and hit targets in the same projection.
            const stage = document.createElement('div');
            stage.className = 'room-stage';
            stage.append(this.canvas);
            if (this.hitLayer) stage.append(this.hitLayer);
            element.prepend(stage);
            this.onInteract = onInteract;
            this.layout = {};
            this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.reduced.addEventListener('change', () => this.draw());
            this.observer = new IntersectionObserver(([entry]) => {
                this.visible = entry.isIntersecting;
                this.draw();
            });
            this.observer.observe(element);
            assetsReady.then(() => { this.hotspots(); this.draw(); });
        }

        update(layout, running, interactive) {
            const layoutKey = JSON.stringify(layout);
            if (this.layoutKey === layoutKey && this.running === running && this.interactive === interactive) return;
            const now = performance.now();
            const resumeFrom = running && !this.running && this.breakSlot
                ? this.avatarAt(this.action ? now - this.action.start : 0, this.layout.desk && this.layout.chair, now).pose
                : null;
            if (this.running !== running || this.layoutKey !== layoutKey || (this.interactive && !interactive)) this.stop();
            this.layout = layout;
            this.layoutKey = layoutKey;
            this.running = running;
            this.interactive = interactive;
            if (running || !layout[this.breakSlot]) this.breakSlot = null;
            this.hotspots();
            if (resumeFrom) this.returnToWork(resumeFrom, now);
            else this.draw();
        }

        hotspots() {
            if (!this.hitLayer) return;
            this.hitLayer.replaceChildren();
            if (!this.interactive) return;
            for (const [slot, id] of Object.entries(this.layout)) {
                if (!root.FlowHubFocusRoom.canInteractWith(slot)) continue;
                const point = this.point(slot);
                const rect = contain(id, ...point);
                const item = root.FlowHubFocusRoom.items[id];
                if (!rect || !item) continue;
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'room-hotspot';
                button.tabIndex = -1;
                button.setAttribute('aria-label', 'Tương tác với ' + item.name);
                button.title = item.name;
                const center = slot === 'bed' ? bedProjection(id, rect).at(0.45, 0.56) :
                    [point[0], rect[1] + rect[3] * (slot === 'desk' ? 0.72 : 0.48)];
                button.style.left = center[0] / W * 100 + '%';
                button.style.top = center[1] / H * 100 + '%';
                button.addEventListener('click', () => this.onInteract(slot));
                this.hitLayer.append(button);
            }
        }

        point(slot) {
            if (positions[slot]) {
                const [x, y, width, height] = positions[slot];
                if (slot === 'sofa') {
                    const modelWidth = sofaWidths[root.FlowHubFocusRoom.items[this.layout.sofa]?.variant] || width;
                    const scale = this.layout.sofa === 'sofa-1' ? sofaScale * 0.85 : sofaScale * 1.10;
                    return [across(x), y, modelWidth * scale, height * scale];
                }
                const center = slot === 'chair' ? deskX + (x - positions.desk[0]) * workScale : across(x);
                const factor = slot === 'desk' ? deskScale : slot === 'chair' ? chairScale : 1;
                return [center, slot === 'chair' ? byDeskFloor(y) : y, width * factor, height * factor];
            }
            const [x, y, width, height] = surfaces[slot];
            return [deskX + (x - 355) * deskScale, deskFloor + (y - deskFloor) * deskScale, width * workScale, height * workScale];
        }

        play(slot, mode, onDone) {
            if (mode === 'manual' && !root.FlowHubFocusRoom.canInteractWith(slot)) return;
            this.stop();
            const paired = this.layout.desk && this.layout.chair;
            if (mode === 'finished') {
                this.breakSlot = this.layout.sofa ? 'sofa' : this.layout.bed ? 'bed' : null;
                if (this.breakSlot) slot = this.breakSlot;
            }
            const rest = mode === 'finished' ? this.stretchPose(paired) : this.restPose(paired);
            const target = mode === 'manual' || (mode === 'finished' && this.breakSlot) ? this.targetPose(slot, paired) : rest;
            const landing = this.landing(slot, target);
            const distance = Math.hypot(landing[0] - rest[0], landing[1] - rest[1]);
            const walkMs = distance < 28 ? 360 : Math.max(710, distance * 7) * (10 / 3);
            const holdMs = slot === 'bed' ? 3200 : slot === 'sofa' ? 1650 : 1350;
            let duration = this.reduced.matches ? holdMs : walkMs * 2 + holdMs;
            if (mode === 'quiet') duration = 1120;
            if (mode === 'finished') duration = stretchMs + (this.breakSlot && !this.reduced.matches ? walkMs : 0);
            const start = performance.now();
            if (mode === 'finished') this.breakStarted = start + duration;
            this.setAction({ slot, mode, onDone, start, duration, rest, target, landing, walkMs, holdMs, distance });
        }

        setAction(action) {
            this.action = action;
            this.timeout = setTimeout(() => this.stop(), action.duration);
            this.draw();
        }

        clearBreak() {
            this.breakSlot = null;
            this.stop();
        }

        stretchPose(paired) {
            return [paired ? byDesk(314) : across(348), paired ? 384 : 415, 'stretch'];
        }

        landing(slot, target) {
            if (slot === 'sofa') return [target[0], positions.sofa[1] + 10];
            if (slot === 'bed') return [across(340), 508];
            return target;
        }

        returnToWork(previous, now) {
            const paired = this.layout.desk && this.layout.chair;
            const rest = this.landing(previous[2], previous);
            const target = this.restPose(paired);
            const distance = Math.hypot(target[0] - rest[0], target[1] - rest[1]);
            if (this.reduced.matches || distance < 28) {
                this.draw();
                return;
            }
            const walkMs = Math.max(710, distance * 7) * (10 / 3);
            this.setAction({ mode: 'return', start: now, duration: walkMs, rest, landing: target, target, walkMs, distance });
        }

        stop() {
            clearTimeout(this.timeout);
            const done = this.action?.onDone;
            this.action = null;
            done?.();
            this.draw();
        }

        restPose(paired) {
            if (!this.running && this.breakSlot && this.layout[this.breakSlot]) return this.targetPose(this.breakSlot, paired);
            if (paired) return [byDesk(308), byDeskFloor(377), this.running ? (this.layout.laptop ? 'type' : 'desk') : 'seated'];
            if (this.running) return this.layout.rug ? [across(443), 469, 'floor'] : [across(342), 413, 'floor'];
            return this.layout.desk ? [byDesk(314), 416, 'stand'] : [across(340), 421, 'stand'];
        }

        targetPose(slot, paired) {
            if (slot === 'sofa' && this.layout.sofa) {
                const sprite = sofaOccupantRect(this.layout.sofa, contain(this.layout.sofa, ...this.point('sofa')));
                if (sprite) return [sprite[0] + sprite[2] * 0.35, sprite[1] + sprite[3], 'sofa'];
            }
            const targets = {
                phone: [319, 400, 'phone'], console: [361, 398, 'console'],
                sofa: [positions.sofa[0], positions.sofa[1] - 12 * sofaScale, 'sofa'],
                bed: [...positions.bed.slice(0, 2), 'bed']
            };
            const target = targets[slot];
            if (!target) return this.restPose(paired);
            const atDesk = slot === 'phone' || slot === 'console';
            return atDesk
                ? [byDesk(target[0]), byDeskFloor(target[1]), target[2]]
                : [across(target[0]), target[1], target[2]];
        }

        avatarAt(elapsed, paired, now = performance.now()) {
            const action = this.action;
            if (!action) return this.breakPose(paired, now);
            if (action.mode === 'finished') {
                if (elapsed >= action.duration && this.breakSlot) return this.breakPose(paired, now);
                if (elapsed < stretchMs || !this.breakSlot || this.reduced.matches) return { pose: action.rest };
                return this.walkAt(action, (elapsed - stretchMs) / action.walkMs);
            }
            if (action.mode === 'return') {
                if (elapsed >= action.walkMs || this.reduced.matches) return { pose: action.target };
                return this.walkAt(action, elapsed / action.walkMs);
            }
            if (action.mode === 'quiet') return { pose: [byDesk(306), 385, 'reach'] };
            const { rest, target, walkMs, holdMs, distance } = action;
            const returning = elapsed > walkMs + holdMs;
            if (this.reduced.matches || (elapsed >= walkMs && !returning)) {
                return { pose: target };
            }
            if (distance < 28) return { pose: rest };
            return this.walkAt(action, (returning ? elapsed - walkMs - holdMs : elapsed) / walkMs, returning);
        }

        breakPose(paired, now) {
            const pose = this.restPose(paired);
            if (this.running || this.breakSlot !== 'sofa') return { pose };
            const slots = ['phone', 'console'].filter(slot => this.layout[slot] && art.breakDevices[slot]);
            if (!slots.length) return { pose };
            let elapsed = Math.max(0, now - this.breakStarted) % (breakRestMs + slots.length * breakDeviceMs);
            if (elapsed < breakRestMs) return { pose, redrawIn: breakRestMs - elapsed };
            elapsed -= breakRestMs;
            return { pose, heldDevice: slots[Math.floor(elapsed / breakDeviceMs)], redrawIn: breakDeviceMs - elapsed % breakDeviceMs };
        }

        walkAt(action, progress, returning = false) {
            const { rest, landing, distance } = action;
            progress = Math.max(0, Math.min(1, progress));
            const t = ease(returning ? 1 - progress : progress);
            // Follow an arc through the open floor rather than sliding through furniture.
            const arc = 4 * t * (1 - t) * Math.min(56, distance * 0.18);
            const x = rest[0] + (landing[0] - rest[0]) * t;
            const y = rest[1] + (landing[1] - rest[1]) * t + arc;
            const travelled = distance * (returning ? 1 - t : t);
            return {
                pose: [x, y, 'walk'],
                stride: Math.floor(travelled / 11) % walkFrames.length,
                mirrored: returning ? landing[0] > rest[0] : landing[0] < rest[0]
            };
        }

        draw(now = performance.now()) {
            cancelAnimationFrame(this.frame);
            clearTimeout(this.breakTimer);
            this.frame = null;
            if (!this.context || !art.frames) return;
            const c = this.context;
            const scale = this.canvas.width / W;
            c.setTransform(scale, 0, 0, scale, 0, 0);
            c.clearRect(0, 0, W, H);
            const action = this.action;
            const elapsed = action ? Math.max(0, now - action.start) : 0;
            const desk = this.layout.desk;
            const paired = desk && this.layout.chair;
            const avatar = this.avatarAt(elapsed, paired, now);
            const [x, y, pose] = avatar.pose;
            const heldDevice = avatar.heldDevice || (pose === 'phone' || pose === 'console' ? pose : null);
            const rects = {};
            for (const [slot, id] of Object.entries(this.layout)) {
                rects[slot] = contain(id, ...this.point(slot));
            }

            for (const slot of ['rug', 'shelf', 'sofa', 'bed', 'desk', 'chair']) {
                const rect = rects[slot];
                if (slot === 'bed' && rect) {
                    const [x, y] = bedProjection(this.layout.bed, rect).at(0.36, 0.91);
                    shadow(c, x, y, rect[2] * 0.38, 11, 0.30);
                } else if (rect) shadow(c, rect[0] + rect[2] * 0.53, rect[1] + rect[3] - 3, rect[2] * 0.64, slot === 'desk' ? 27 : 14, 0.44);
            }
            for (const slot of ['wall', 'rug', 'shelf', 'sofa', 'desk']) paint(c, this.layout[slot], rects[slot]);

            if (this.layout.lamp && this.running) {
                const [, y] = this.point('lamp');
                glow(c, byDesk(391), y + 6, this.layout.lamp === 'lamp-4');
            }
            for (const slot of ['lamp', 'laptop', 'phone', 'console']) {
                const id = this.layout[slot];
                if (!id || slot === heldDevice) continue;
                const rect = rects[slot];
                if (!rect) continue;
                shadow(c, rect[0] + rect[2] * 0.56, rect[1] + rect[3] - 1, rect[2] * 0.59, 6, 0.31);
                c.save();
                if (slot === 'phone' && this.running) c.filter = 'brightness(0.68) saturate(0.6)';
                if (slot === 'laptop' && !this.running) c.filter = 'brightness(0.88)';
                paint(c, id, rect);
                c.restore();
            }

            const [staticSprite, height] = poses[pose] || [];
            const sprite = pose === 'walk' ? walkFrames[avatar.stride] : staticSprite;
            const animate = this.visible && !this.reduced.matches;
            const typing = animate && pose === 'type';
            const bob = typing ? Math.sin(now / 200) * 0.9 : 0;
            const behindBed = ['type', 'desk', 'seated'].includes(pose);
            const actorScale = behindBed ? workScale : pose === 'console' ? consoleActorScale : 1;
            const character = sprite === undefined ? null : contain('person-' + sprite, x, y + bob, 222 * actorScale, height * actorScale);
            paint(c, this.layout.chair, rects.chair);
            if (!behindBed) paintBed(c, this.layout.bed, rects.bed, pose === 'bed');
            if (pose === 'sofa') {
                const person = art.breakDevices[avatar.heldDevice] || art.sofaOccupant;
                const occupant = sofaOccupantRect(this.layout.sofa, rects.sofa, person);
                if (occupant) {
                    const [left, top, width, height] = occupant;
                    for (const [u, v] of sofaSpriteFeet) shadow(c, left + width * u, top + height * v, width * 0.23, 4, 0.24);
                    c.drawImage(person, ...occupant);
                }
            }
            if (character) {
                shadow(c, x, y - 2, character[2] * 0.52, 11, 0.42);
                paint(c, 'person-' + sprite, character, avatar.mirrored);
                // The phone is already painted into the hand of its character sprite.
                if (heldDevice === 'console') {
                    const id = this.layout.console;
                    const handX = character[0] + character[2] * 0.84;
                    const handY = character[1] + character[3] * 0.68;
                    paint(c, id, contain(id, handX, handY, 39 * consoleActorScale, 25 * actorScale));
                }
                // Keep the near edge of the chair in front of the seated character.
                if (rects.chair && behindBed) {
                    const [left, top, width, seatHeight] = rects.chair;
                    c.save();
                    c.beginPath();
                    c.moveTo(left, top);
                    c.lineTo(left + width * 0.34, top);
                    c.lineTo(left + width * 0.57, top + seatHeight * 0.55);
                    c.lineTo(left + width, top + seatHeight * 0.68);
                    c.lineTo(left + width, top + seatHeight);
                    c.lineTo(left, top + seatHeight);
                    c.closePath();
                    c.clip();
                    paint(c, this.layout.chair, rects.chair);
                    c.restore();
                }
            }
            if (behindBed) paintBed(c, this.layout.bed, rects.bed, false);
            if (animate && (action || typing)) this.frame = requestAnimationFrame(time => this.draw(time));
            else if (this.visible && avatar.redrawIn) this.breakTimer = setTimeout(() => this.draw(), avatar.redrawIn);
        }
    }

    root.FocusRoomArt = { Scene, thumbnail };
})(window);

