const ffmpeg = require("fluent-ffmpeg")

const processVideo = async () => {
    const inputPath = "./file/video.mp4"
    const outputPath = "./file/output2.mp4"

    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoCodec("libx264")
            .audioCodec("aac")
            .format("mp4")
            .outputOptions([
                "-movflags +faststart",
                "-preset fast",
                "-crf 23"
            ])
            .output(outputPath)
            .on("start", cmd => console.log("Started with command:", cmd))
            .on("progress", progress => console.log("Processing:", progress.percent + "% done"))
            .on("end", () => {
                console.log("Video transformation completed")
                resolve()
            })
            .on("error", err => {
                console.error("FFmpeg error:", err)
                reject()
            })
            .run()
    })
}

processVideo().catch(console.log)