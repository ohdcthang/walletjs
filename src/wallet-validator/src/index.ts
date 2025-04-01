export class InvalidMnemonicError extends Error {
  public code = 'INVALID_MNEMONIC';
  public details?: any;

  constructor(details?: any) {
    super('Invalid mnemonic provided');
    this.details = details;
    Object.setPrototypeOf(this, InvalidMnemonicError.prototype);
  }
}

export class InvalidPrivateKeyError extends Error {
  public code = 'INVALID_PRIVATE_KEY';
  public details?: any;

  constructor(details?: any) {
    super('Invalid private key provided');
    this.details = details;
    Object.setPrototypeOf(this, InvalidPrivateKeyError.prototype);
  }
}

export class UnsupportedTransactionTypeError extends Error {
  public code = 'UNSUPPORTED_TRANSACTION_TYPE';
  public details?: any;

  constructor(details?: any) {
    super('Unsupported transaction type');
    this.details = details;
    Object.setPrototypeOf(this, UnsupportedTransactionTypeError.prototype);
  }
}

export class GasEstimationError extends Error {
  public code = 'GAS_ESTIMATION_ERROR';
  public details?: any;

  constructor(details?: any) {
    super('Failed to estimate gas');
    this.details = details;
    Object.setPrototypeOf(this, GasEstimationError.prototype);
  }
}

export class TransferFailedError extends Error {
  public code = 'TRANSFER_FAILED';
  public details?: any;

  constructor(details?: any) {
    super('Transfer failed');
    this.details = details;
    Object.setPrototypeOf(this, TransferFailedError.prototype);
  }
}

export class NetworkFailedError extends Error {
  public code = 'NETWORK_FAILED';
  public details?: any;

  constructor(details?: any) {
    super('Network wrong');
    this.details = details;
    Object.setPrototypeOf(this, TransferFailedError.prototype);
  }
}
