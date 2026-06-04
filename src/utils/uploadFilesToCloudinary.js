import { cloudinary } from "../config/cloudinary.js";

const uploadFilesToCloudinary = async (files) => {
    try {
        if (!files || !files.length) return [];

        const uploads = files.map(async (file) => {

            if (!file.img || !file.img.length) return file;

            const imageUploads = file.img.map((image) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(
                        image,
                        {
                            folder: "spexnation",
                            resource_type: "auto",
                        },
                        (err, result) => {
                            if (err) {
                                console.error("Cloudinary Upload Error:", err);
                                reject(err);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    );
                });
            });

            const uploadedImages = await Promise.all(imageUploads);

            return {
                ...file,
                img: uploadedImages
            };
        });

        return await Promise.all(uploads);

    } catch (error) {
        console.error("Upload Error:", error);
        return [];
    }
};

export default uploadFilesToCloudinary;