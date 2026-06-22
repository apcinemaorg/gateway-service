export class SendOtpRequest {
    public identifier: string
    public type: 'phone' | 'email'
}