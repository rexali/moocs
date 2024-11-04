import ffmpeg from "ffmpeg";

export class CompressImageVideo {

    image: any;
    video: any;

    constructor(image?: string, video?: string) {
        this.image = image;
        this.video = video;
    }

    compressImage = () => {
        try {
            new ffmpeg(this.image, (err, image) => {
                if (err) {
                    throw err;
                }
            
                image.setVideoSize('50%', true, true)
                    // .setVideoCodec("libfaac")
                    .save('./');
            });

        } catch (error) {
            console.error(error);
        }

    }

    compressVideo = () => {
        new ffmpeg(this.video, (err, video) => {
            if (!err) {
                video.setVideoSize('50%', true, true)
                    // .setVideoCodec("libfaac")
                    .save('./')
            } else {
                console.error(err)
            }

        });
    }
}


