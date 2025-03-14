export interface ServerData {
    origin: string
    ip: string;
    hostname: string | null;
    country: string | null;
    city: string | null;
    org: string;
    isLocal?: boolean;
    isBrowserResource?: boolean;
}
