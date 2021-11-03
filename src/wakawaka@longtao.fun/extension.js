/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ByteArray = imports.byteArray;
const GLib = imports.gi.GLib;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));

        this.add_child(new St.Icon({
            icon_name: 'face-cool-symbolic',
            style_class: 'system-status-icon',
        }));

        let item1 = new PopupMenu.PopupMenuItem(_('wakatime'));
        item1.connect('activate', () => {
            let a ="not found wakatime, please install wakatime!"
            try {
                let [, stdout, stderr, status] = GLib.spawn_command_line_sync('wakatime --today');

                if (status !== 0) {
                    if (stderr instanceof Uint8Array)
                        stderr = ByteArray.toString(stderr);

                    throw new Error(stderr);
                }
                if (stdout instanceof Uint8Array)
                    stdout = ByteArray.toString(stdout);

                log(stdout);
                a = stdout
            } catch (e) {
                logError(e);
            }

            Main.notify('code time',_(a));
        });
        this.menu.addMenuItem(item1);
        let item2 = new PopupMenu.PopupMenuItem(_('info'));
        item2.connect('activate', () => {
            let a ="not found uptime"
            try {
                let [, stdout, stderr, status] = GLib.spawn_command_line_sync('uptime');

                if (status !== 0) {
                    if (stderr instanceof Uint8Array)
                        stderr = ByteArray.toString(stderr);

                    throw new Error(stderr);
                }

                if (stdout instanceof Uint8Array)
                    stdout = ByteArray.toString(stdout);

                log(stdout);
                a = stdout
            } catch (e) {
                logError(e);
            }

            Main.notify("cpu&memory",_(a));
        });
        this.menu.addMenuItem(item2);
        let item3 = new PopupMenu.PopupMenuItem(_('鼓励'));
        item3.connect('activate', () => {
            let a ="not found"
            try {
                let [, stdout, stderr, status] = GLib.spawn_command_line_sync('echo 加油！打工人！');

                if (status !== 0) {
                    if (stderr instanceof Uint8Array)
                        stderr = ByteArray.toString(stderr);

                    throw new Error(stderr);
                }
                if (stdout instanceof Uint8Array)
                    stdout = ByteArray.toString(stdout);

                log(stdout);
                a = stdout
            } catch (e) {
                logError(e);
            }

            Main.notify("程序员鼓励师",_(a));
        });
        this.menu.addMenuItem(item3);
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
