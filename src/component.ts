import OsmdPlugin from 'main';
import { Component } from 'obsidian';


export class OsmdPluginComponent extends Component {
    constructor(public plugin: OsmdPlugin) {
        super();
    }

    get app() {
        return this.plugin.app;
    }

    get settings() {
        return this.plugin.settings;
    }
}
