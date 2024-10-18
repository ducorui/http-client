
interface Toast {
    toast: any | null;
    isAlert: boolean;
    isDisabled: boolean;
    setConfig: (alertOrToast: "alert" | boolean | any) => void;
}

class ToastNotification implements Toast {
    toast: any | null = null;
    isAlert: boolean = false;
    isDisabled: boolean = false;

    constructor() {
        return new Proxy(this, {
            get: (target, methodName: string) => {
                if (methodName in target) {
                    return (target as any)[methodName]; // Return existing methods
                }

                // Return a function for dynamic method invocation
                return (...args: any[]): void => {
                    const { message, description } = args[0] || {}; // Destructure the first argument for message and description
                    return target.methodAction(methodName, message, description);
                };
            }
        });
    }

    public setConfig(alertOrToast: "alert" | boolean | any): void {
        if (alertOrToast === "alert" || alertOrToast === true) {
            this.isAlert = true;
            this.isDisabled = false;
            this.toast = null; // Clear any previous toast configuration
        } else if (alertOrToast && typeof alertOrToast === 'object') {
            this.isAlert = false; // Disable alert mode
            this.isDisabled = false; // Enable toast mode
            this.toast = alertOrToast; // Set toast config
        } else {
            this.isDisabled = true; // Disable toast notifications
            this.toast = null; // Clear toast
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

        // Check if the toast configuration has a method with the specified name
        if (this.toast && typeof this.toast[methodName] === 'function') {
            this.toast[methodName](message, description); // Call the specified method with arguments
        } else {
            console.warn(`Method ${methodName} is not defined on the toast object.`);
        }
    }
}

export default ToastNotification;
export type AnyMethod = (...args: any[]) => any;
