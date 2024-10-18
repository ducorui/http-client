
interface Toast {
    container: any | null;
    isAlert: boolean;
    isDisabled: boolean;
    setConfig: (alertOrToast: "alert" | boolean | any) => void;
}

class ToastNotification implements Toast {
    container: any | null = null;
    isAlert: boolean = false;
    isDisabled: boolean = false;

    constructor() {
        return new Proxy(this, {
            get: (target, methodName: string) => {

                if (methodName in target) {                    
                    // @ts-ignore
                    return target[methodName];
                  }

                // Return a function for dynamic method invocation
                return (...args: any[]): void => {
                    const [message, description] = args;
                    return (target as any).methodAction(methodName, message, description);
                };
            }
        });
    }

    public setConfig(alertOrToast: any): void {

        

        if (alertOrToast === "alert" || alertOrToast === true) {
            this.isAlert = true;
            this.isDisabled = false;
            this.container = false; // Clear any previous toast configuration
        } else if (alertOrToast && (typeof alertOrToast === 'object' || typeof alertOrToast === 'function') ) {
            this.isAlert = false; // Disable alert mode
            this.isDisabled = false; // Enable toast mode
            this.container = alertOrToast; // Set toast config
        } else {
            this.isDisabled = true; // Disable toast notifications
            this.container = false; // Clear toast
            this.isAlert = false; // Ensure alert mode is off
        }
    }

    public methodAction(methodName: string, message: string, description?: string): void {
        if (this.isDisabled) {
            return; // If notifications are disabled, do nothing
        }

        if (this.isAlert) {
            alert(message); // Display alert with the message
        }
        console.log("function", methodName, message, description);
        // Check if the toast configuration has a method with the specified name
        if (this.container && typeof this.container[methodName] === 'function') {
            console.log("function", methodName, message, description);
            if(typeof message === 'string' && typeof message === 'string') {
                this.container[methodName](message, description); // Call the specified method with arguments
            }else if(typeof message === 'string'){
                this.container[methodName](message)
            }
        } else {
            console.warn(`Method ${methodName} is not defined on the toast object.`);
        }
    }
}

export default ToastNotification;
