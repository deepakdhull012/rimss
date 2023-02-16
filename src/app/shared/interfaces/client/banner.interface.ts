export enum BannerType {
    INFO,
    SUCCESS,
    ERROR,
    WARN
}

export interface IBannerConfig {
    type: BannerType;
    message: string;
    closeIcon: boolean;
    closeTime: number;
}