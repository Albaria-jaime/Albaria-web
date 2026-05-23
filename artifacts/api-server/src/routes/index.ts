import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyticsRouter from "./analytics";
import demoRouter from "./demo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analyticsRouter);
router.use(demoRouter);

export default router;
