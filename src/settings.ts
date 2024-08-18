import { Component, MarkdownRenderer, PluginSettingTab, Setting, TextAreaComponent } from 'obsidian';
import OsmdPlugin from 'main';


export interface OsmdSettings {
	options: string;
	optionFormat: "yaml" | "json";
	logLevel: typeof LOG_LEVELS[number];
}

export const DEFAULT_SETTINGS: OsmdSettings = {
	options: "",
	optionFormat: "yaml",
	logLevel: "warn"
};

const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"] as const;

// Inspired by https://stackoverflow.com/a/50851710/13613783
export type KeysOfType<Obj, Type> = NonNullable<{ [k in keyof Obj]: Obj[k] extends Type ? k : never }[keyof Obj]>;

export class OsmdSettingTab extends PluginSettingTab {
	component: Component;
	textArea: TextAreaComponent;

	constructor(public plugin: OsmdPlugin) {
		super(plugin.app, plugin);
		this.component = new Component();
	}

	display(): void {
		this.component.load();
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName("Options")
			.then(({ descEl }) => {
				MarkdownRenderer.render(
					this.app,
					"You can specify the options to pass to the OSMD rendering engine (either in the YAML or JSON format; see the next setting). See [OSMD's website](https://opensheetmusicdisplay.github.io/classdoc/interfaces/IOSMDOptions.html) for a list of available options.",
					descEl, "", this.component
				)
			})
			.addTextArea((textArea) => {
				this.textArea = textArea;
				textArea
					.setValue(this.plugin.settings.options)
					.onChange((value) => {
						this.plugin.settings.options = value;
						this.plugin.saveSettings();
					});
				textArea.inputEl.rows = 10;
				textArea.inputEl.cols = 30;
			});

		new Setting(this.containerEl)
			.setName("Format of the options")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("yaml", "YAML")
					.addOption("json", "JSON")
					.setValue(this.plugin.settings.optionFormat)
					.onChange((value: OsmdSettings['optionFormat']) => {
						const oldValue = this.plugin.settings.optionFormat;
						if (oldValue === value) return;

						const options = this.plugin.parseOsmdOptions();
						this.plugin.settings.optionFormat = value;
						this.textArea.setValue(this.plugin.settings.options = this.plugin.stringifyOsmdOptions(options));

						this.plugin.saveSettings();
					});
			});

		new Setting(this.containerEl)
			.setName("Log level")
			.setDesc("How much information should be logged to the developer console.")
			.addDropdown((dropdown) => {
				dropdown
					.addOptions(LOG_LEVELS.reduce((acc, level) => {
						acc[level] = level[0].toUpperCase() + level.slice(1);
						return acc;
					}, {} as Record<typeof LOG_LEVELS[number], string>))
					.setValue(this.plugin.settings.logLevel)
					.onChange((value: OsmdSettings['logLevel']) => {
						this.plugin.settings.logLevel = value;
						this.plugin.saveSettings();
					});
			});

		new Setting(this.containerEl)
		.setName('More options')	
		.setDesc(`You can find more options in Style Settings > ${this.plugin.manifest.name}.`)
			.addButton((button) => {
				button.setButtonText('Open Style Settings')
					.onClick(() => {
						// @ts-ignore
						const styleSettingsTab = this.app.setting.pluginTabs.find((tab) => tab.id === 'obsidian-style-settings');
						if (styleSettingsTab) {
							// @ts-ignore
							this.app.setting.openTab(styleSettingsTab);
						} else {
							open('obsidian://show-plugin?id=obsidian-style-settings');
						}
					});
			});
	}

	hide() {
		super.hide();
		this.component.unload();
	}
}
