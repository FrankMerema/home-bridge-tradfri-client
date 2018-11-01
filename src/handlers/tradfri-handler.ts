import * as fs from 'fs';
import { Accessory, AccessoryTypes, discoverGateway, TradfriClient } from 'node-tradfri-client';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const config = require('../../service.config.json');

export class TradfriHandler {

    private tradfri: TradfriClient;

    constructor() {
        from(discoverGateway())
            .pipe(switchMap(result => {
                this.tradfri = new TradfriClient(result.host, {watchConnection: true});

                if (!config.tradfriAuth.identity || config.tradfriAuth.identity === '' ||
                    !config.tradfriAuth.psk || config.tradfriAuth.psk === '') {
                    return this.authenticate()
                        .pipe(switchMap(() => this.connect()));
                } else {
                    return this.connect();
                }
            }))
            .subscribe(() => {
                this.tradfri.on('device updated', (device: Accessory) => {
                    if (device.type === AccessoryTypes.lightbulb) {
                        console.log(device);
                    }
                }).observeDevices();
            });
    }


    private authenticate(): Observable<{ identity: string; psk: string }> {
        return from(this.tradfri.authenticate(config.tradfriSecurityCode))
            .pipe(map(tradfriAuth => {
                config.tradfriAuth = tradfriAuth;
                delete config.tradfriSecurityCode;
                fs.writeFileSync('service.config.json', JSON.stringify(config));

                return tradfriAuth;
            }));
    }

    private connect(): Observable<boolean> {
        return from(this.tradfri.connect(config.tradfriAuth.identity, config.tradfriAuth.psk));
    }
}
