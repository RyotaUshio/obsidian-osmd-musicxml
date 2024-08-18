import { Plugin } from 'obsidian';
import { OpenSheetMusicDisplayEmbed } from 'osmd';
import { OsmdSettings, DEFAULT_SETTINGS, OsmdSettingTab } from 'settings';
import { EmbedCreator } from 'typings';


export const MUSESCORE_EXTENSIONS = ['mscz'];
export const MUSESCORE_VIEW_TYPE = 'musescore';

export const MUSICXML_EXTENSIONS = ['mxl', 'musicxml'];


export default class OsmdPlugin extends Plugin {
	settings: OsmdSettings;

	async onload() {
		await this.loadSettings();
		await this.saveSettings();
		this.addSettingTab(new OsmdSettingTab(this));

		// this.registerEmbed(MUSESCORE_EXTENSIONS, (ctx, file) => {
		// 	return new MuseScoreEmbed(ctx, file);
		// })

		this.registerEmbed(MUSICXML_EXTENSIONS, (ctx, file, subpath) => {
			return new OpenSheetMusicDisplayEmbed(this, ctx.containerEl, file, subpath);
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	registerEmbed(extensions: string[], embedCreator: EmbedCreator) {
		this.app.embedRegistry.registerExtensions(extensions, embedCreator);
		this.register(() => {
			return this.app.embedRegistry.unregisterExtensions(extensions);
		});
	}

	private async loadVerovio() {

	}
}
