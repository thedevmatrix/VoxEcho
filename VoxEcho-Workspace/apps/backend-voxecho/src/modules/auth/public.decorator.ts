import { SetMetadata } from "@nestjs/common";

// we set meta data to be able to mame some route public, becuause it was set as global as default
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);