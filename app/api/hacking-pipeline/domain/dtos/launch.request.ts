export interface LaunchRequestDTO {
  url: string;
}

export class LaunchRequest implements LaunchRequestDTO {
  constructor(public readonly url: string) {}
}
