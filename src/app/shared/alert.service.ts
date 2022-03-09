import {Injectable} from '@angular/core';
import {AlertController, LoadingController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    }

    public async showConfirmAlert(handlerAction: Function, options?: { header?: string; msj?: string; }) {
        const alert = await this.alertCtrl.create({
            'header': options ? options.header : 'Eliminar',
            'message': options ? options.msj : '¿Deseas eliminar esta tarea?',
            'buttons': [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    id: 'cancel-button'
                },
                {
                    text: 'Aceptar',
                    cssClass: 'secondary',
                    id: 'confirm-button',
                    handler: (_) => handlerAction()
                }
            ]
        });
        await alert.present();
    }

    async showLoading(msj = 'Espere por favor...') {
        const loading = await this.loadingCtrl.create({
            message: msj, // duration: 2000
        });
        await loading.present();
    }

    async closeLoading() {
        await this.loadingCtrl.dismiss();
    }

}
