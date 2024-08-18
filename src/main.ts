import { parseYaml, Plugin, stringifyYaml } from 'obsidian';
import { IOSMDOptions } from 'opensheetmusicdisplay';
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

	parseOsmdOptions(): IOSMDOptions {
		if (!this.settings.options) {
			return {};
		}

		try {
			if (this.settings.optionFormat === 'yaml') {
				return parseYaml(this.settings.options);
			} else {
				return JSON.parse(this.settings.options);
			}
		} catch (e) {
			console.error('Failed to parse the options', e);
			return {};
		}
	}

	stringifyOsmdOptions(options: IOSMDOptions) {
		if (this.settings.optionFormat === 'yaml') {
			return stringifyYaml(options);
		} else {
			return JSON.stringify(options, null, 2);
		}
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
