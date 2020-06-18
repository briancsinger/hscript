export enum OrderStatus {
    // When the order has been created but the ticket it is trying to order has not been reserved
    Created = 'created',

    // the ticket the order is tring to reserve has already been reserved or when the user has canceled the order
    // the order expires before the payment
    Canceled = 'canceled',

    // the order has sucesfuly reerved the ticket
    AwaitingPayment = 'awaiting:payment',

    // the order has reserved the ticket and the user has provided payment successfully
    Complete = 'complete',
}
