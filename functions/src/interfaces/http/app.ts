import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";
import { corsOptions } from "../../config/cors";
import { setupSwagger } from "./docs/swagger";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

setupSwagger(app);

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

export default app;
