import { ErrorHandler, Injectable } from '@angular/core';
import { LogsService } from './shared/services/logs.service';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private logger: LogsService) { }

    handleError(error: any): void {
        // Log the error using the LoggingService
        // this.loggingService.logError(error);
        // this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        // let body = {
        //     userId: this.loggedInuser.id,
        //     email: this.loggedInuser.email,
        //     additionalData: error,
        //     clientSideData: navigator.userAgent,
        // }
        // this.logger.log('Getting Dashboard Data', "error", body);
        console.log(error);


        // You can also re-throw the error if needed
        throw error;
    }
}
