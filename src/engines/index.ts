import type { ComponentType } from "react";
import type { MotorProps } from "../types";
import { Explorar } from "./explorar/Explorar";

export const MOTORES: Record<string, ComponentType<MotorProps<any>>> = {
  explorar: Explorar,
};
