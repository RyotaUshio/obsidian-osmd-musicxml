import { Plugin } from 'obsidian';
import { SheetMusicSettings, DEFAULT_SETTINGS, SheetMusicSettingTab } from 'settings';


export default class SheetMusicPlugin extends Plugin {
	settings: SheetMusicSettings;

	async onload() {
		await this.loadSettings();
		await this.saveSettings();
		this.addSettingTab(new SheetMusicSettingTab(this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
