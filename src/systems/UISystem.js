import { accessibilityConfig } from '../config/accessibilityConfig.js';
import { progressionConfig } from '../config/progressionConfig.js';
import { combatConfig } from '../config/combatConfig.js';

export default class UISystem {
  constructor(scene) {
    this.scene = scene;
    this.hud = {};
    this.toastQueue = [];
    this.menuOpen = false;
    this.shopOpen = false;
  }

  init() {
    this.createHUD();
    this.createDomPanels();
    this.bindInput();
  }

  bindInput() {
    const input = this.scene.systemsRef.input;
    this.scene.input.keyboard.on('keydown', (ev) => {
      if (ev.code === 'Escape') this.togglePauseMenu();
    });

    // keep via mapping too
    this.scene.events.on('postupdate', () => {
      if (input.pressed('pause')) this.togglePauseMenu();
      if (input.pressed('debug')) this.scene.systemsRef.debugOverlay.toggle();
    });
  }

  createHUD() {
    const style = { fontFamily: 'monospace', fontSize: '18px', color: '#e7f3ff', stroke: '#000000', strokeThickness: 3 };
    this.hud.hp = this.scene.add.text(18, 14, 'HP', style).setScrollFactor(0).setDepth(400);
    this.hud.energy = this.scene.add.text(18, 40, 'EN', style).setScrollFactor(0).setDepth(400);
    this.hud.xp = this.scene.add.text(18, 66, 'XP', style).setScrollFactor(0).setDepth(400);
    this.hud.gold = this.scene.add.text(18, 92, 'GOLD', style).setScrollFactor(0).setDepth(400);
    this.hud.distance = this.scene.add.text(18, 118, 'DIST', style).setScrollFactor(0).setDepth(400);
    this.hud.skills = this.scene.add.text(18, 148, '', style).setScrollFactor(0).setDepth(400);

    this.hud.toast = this.scene.add.text(this.scene.scale.width / 2, 30, '', {
      fontFamily: 'monospace', fontSize: '20px', color: '#fff3c4', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(420).setAlpha(0);

    this.hud.tutorial = this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height - 72, '', {
      fontFamily: 'monospace', fontSize: '17px', color: '#d2f0ff', stroke: '#000', strokeThickness: 4, align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(420).setAlpha(0);
  }

  createDomPanels() {
    const root = document.getElementById('overlay-root');
    root.innerHTML = '';

    const pause = document.createElement('div');
    pause.id = 'pause-panel';
    pause.className = 'panel hidden';
    pause.innerHTML = `
      <h2>Paused</h2>
      <div class="row"><button id="btn-resume">Continue</button><button id="btn-restart">Restart Run</button></div>
      <h3>Settings</h3>
      <div class="settings-grid">
        <label>Master <input id="set-master" type="range" min="0" max="100" value="80"></label>
        <label>Music <input id="set-music" type="range" min="0" max="100" value="65"></label>
        <label>SFX <input id="set-sfx" type="range" min="0" max="100" value="85"></label>
        <label>UI <input id="set-ui" type="range" min="0" max="100" value="80"></label>
        <label>Shake <input id="set-shake" type="range" min="0" max="100" value="${accessibilityConfig.screenShake}"></label>
        <label>VFX <input id="set-vfx" type="range" min="0" max="100" value="${accessibilityConfig.vfxIntensity}"></label>
        <label>Font
          <select id="set-font"><option value="1">100%</option><option value="1.25">125%</option><option value="1.5">150%</option></select>
        </label>
        <label>High Contrast <input id="set-contrast" type="checkbox"></label>
        <label>Reduce Flashes <input id="set-flash" type="checkbox"></label>
      </div>
      <h3>Rebind Controls</h3>
      <div id="rebind-list" class="rebind-list"></div>
    `;
    root.appendChild(pause);
    this.pausePanel = pause;

    const shop = document.createElement('div');
    shop.id = 'shop-panel';
    shop.className = 'panel hidden';
    shop.innerHTML = `
      <h2>Merchant</h2>
      <div class="shop-grid">
        <button id="shop-heal">Heal 25% HP</button>
        <button id="shop-talent">Random Talent</button>
        <button id="shop-upg1">Upgrade Q Skill</button>
        <button id="shop-upg2">Upgrade W Skill</button>
        <button id="shop-upg3">Upgrade E Skill</button>
        <button id="shop-upg4">Upgrade R Skill</button>
        <button id="shop-upg5">Upgrade F Skill</button>
        <button id="shop-reforge">Reforge Passive</button>
        <button id="shop-reroll">Reroll Offer</button>
        <button id="shop-refresh">Refresh Shop</button>
      </div>
      <button id="shop-close">Close</button>
    `;
    root.appendChild(shop);
    this.shopPanel = shop;

    this.bindPanelButtons();
    this.populateRebindList();
  }

  bindPanelButtons() {
    document.getElementById('btn-resume').onclick = () => this.togglePauseMenu(false);
    document.getElementById('btn-restart').onclick = () => this.scene.scene.restart({ seed: this.scene.runSeed + 1 });

    document.getElementById('set-master').oninput = (e) => this.scene.systemsRef.audio.setBusVolume('master', +e.target.value / 100);
    document.getElementById('set-music').oninput = (e) => this.scene.systemsRef.audio.setBusVolume('music', +e.target.value / 100);
    document.getElementById('set-sfx').oninput = (e) => this.scene.systemsRef.audio.setBusVolume('sfx', +e.target.value / 100);
    document.getElementById('set-ui').oninput = (e) => this.scene.systemsRef.audio.setBusVolume('ui', +e.target.value / 100);
    document.getElementById('set-shake').oninput = (e) => this.scene.systemsRef.vfx.setShakeStrength(+e.target.value / 100);
    document.getElementById('set-vfx').oninput = (e) => this.scene.systemsRef.vfx.setIntensity(+e.target.value / 100);
    document.getElementById('set-font').onchange = (e) => {
      const scale = +e.target.value;
      this.hud.hp.setScale(scale); this.hud.energy.setScale(scale); this.hud.xp.setScale(scale); this.hud.gold.setScale(scale); this.hud.distance.setScale(scale); this.hud.skills.setScale(scale);
    };
    document.getElementById('set-contrast').onchange = (e) => {
      document.body.classList.toggle('high-contrast', !!e.target.checked);
    };
    document.getElementById('set-flash').onchange = (e) => this.scene.systemsRef.vfx.setReducedFlashes(!!e.target.checked);

    document.getElementById('shop-heal').onclick = () => this.scene.systemsRef.economy.buyHeal25();
    document.getElementById('shop-talent').onclick = () => this.scene.systemsRef.economy.buyRandomTalent();
    document.getElementById('shop-upg1').onclick = () => this.scene.systemsRef.economy.buySkillUpgrade('ascendingRupture');
    document.getElementById('shop-upg2').onclick = () => this.scene.systemsRef.economy.buySkillUpgrade('shadowStep');
    document.getElementById('shop-upg3').onclick = () => this.scene.systemsRef.economy.buySkillUpgrade('flowBlade');
    document.getElementById('shop-upg4').onclick = () => this.scene.systemsRef.economy.buySkillUpgrade('freezingPrism');
    document.getElementById('shop-upg5').onclick = () => this.scene.systemsRef.economy.buySkillUpgrade('overloadCore');
    document.getElementById('shop-reforge').onclick = () => this.scene.systemsRef.economy.reforgeTalents();
    document.getElementById('shop-reroll').onclick = () => {
      const ok = this.scene.systemsRef.economy.rerollOffer();
      if (ok) {
        const offers = this.scene.systemsRef.talent.pendingOffer;
        if (offers.length) {
          const labels = offers.map((o, i) => `${i+1}: ${o.id}`).join(' | ');
          this.toast(`Reroll offers -> ${labels}. Press 1 or 2`);
          const key1 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
          const key2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
          const choose = () => {
            if (Phaser.Input.Keyboard.JustDown(key1)) this.scene.systemsRef.talent.pickOffer(0);
            if (Phaser.Input.Keyboard.JustDown(key2)) this.scene.systemsRef.talent.pickOffer(1);
          };
          const evt = this.scene.events.on('update', choose);
          this.scene.time.delayedCall(4500, () => this.scene.events.off('update', choose));
        }
      }
    };
    document.getElementById('shop-refresh').onclick = () => this.scene.systemsRef.economy.refreshShop();
    document.getElementById('shop-close').onclick = () => this.openShop(false);
  }

  populateRebindList() {
    const root = document.getElementById('rebind-list');
    root.innerHTML = '';
    const bindings = this.scene.systemsRef.input.bindings;
    Object.keys(bindings).forEach((action) => {
      const row = document.createElement('div');
      row.className = 'rebind-row';
      row.innerHTML = `<span>${action}</span><button data-action="${action}">${bindings[action]}</button>`;
      root.appendChild(row);
    });
    root.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.onclick = () => this.awaitRebind(btn.dataset.action, btn);
    });
  }

  awaitRebind(action, button) {
    button.textContent = 'Press key...';
    const handler = (ev) => {
      const key = ev.code.replace('Key', '').replace('Digit', '').toUpperCase();
      const ok = this.scene.systemsRef.input.setBinding(action, key);
      button.textContent = ok ? key : 'Invalid';
      if (!ok) this.scene.time.delayedCall(700, () => { button.textContent = this.scene.systemsRef.input.bindings[action]; });
      this.scene.input.keyboard.off('keydown', handler);
      this.populateRebindList();
    };
    this.scene.input.keyboard.on('keydown', handler);
  }

  openShop(open = true) {
    this.shopOpen = open;
    this.shopPanel.classList.toggle('hidden', !open);
  }

  togglePauseMenu(force = null) {
    this.menuOpen = force == null ? !this.menuOpen : !!force;
    this.pausePanel.classList.toggle('hidden', !this.menuOpen);
    this.scene.physics.world.isPaused = this.menuOpen;
  }

  toast(msg) {
    this.toastQueue.push({ msg, at: performance.now() });
    this.showToastImmediate();
  }

  showToastImmediate() {
    if (!this.toastQueue.length) return;
    const top = this.toastQueue[this.toastQueue.length - 1];
    this.hud.toast.setText(top.msg);
    this.hud.toast.setAlpha(1);
    this.scene.tweens.add({
      targets: this.hud.toast,
      alpha: 0,
      duration: 1500,
      ease: 'Quad.easeOut'
    });
  }

  tutorial(msg) {
    this.hud.tutorial.setText(msg).setAlpha(1);
    this.scene.tweens.killTweensOf(this.hud.tutorial);
    this.scene.tweens.add({ targets: this.hud.tutorial, alpha: 0, delay: 3200, duration: 800 });
  }

  update(now) {
    const p = this.scene.state.player;
    const xpNeed = progressionConfig.xpFormula(p.level);
    this.hud.hp.setText(`HP ${Math.round(p.hp)}/${p.maxHp}`);
    this.hud.energy.setText(`EN ${Math.round(p.energy)}/${p.maxEnergy}`);
    this.hud.xp.setText(`LV ${p.level} XP ${Math.round(p.xp)}/${xpNeed}`);
    this.hud.gold.setText(`G ${p.gold}`);
    this.hud.distance.setText(`DIST ${p.distance}m`);

    const skills = combatConfig.skills;
    const ids = ['ascendingRupture','shadowStep','flowBlade','freezingPrism','overloadCore'];
    const chars = ['Q','W','E','R','F'];
    const parts = ids.map((id, i) => {
      const cd = Math.max(0, p.getCooldownRemaining(id, now));
      return `${chars[i]}:${cd > 0 ? (cd/1000).toFixed(1) : 'READY'}`;
    });
    this.hud.skills.setText(parts.join(' | '));
  }
}
