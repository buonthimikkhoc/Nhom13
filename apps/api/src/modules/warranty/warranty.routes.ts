import { Router } from "express";
import { lookupWarranty } from "./warranty.controller";

const router = Router();

router.get("/lookup", lookupWarranty);

export default router;

