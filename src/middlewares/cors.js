const allowedOrigins = [
    process.env.FRONTEND_URL_PRODUCTION,
    process.env.FRONTEND_URL_DEVELOPMENT,
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

export default corsOptions;