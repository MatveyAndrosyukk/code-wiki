export default function extractImagesName (content: string): string[] {
    const imageRegex = /\[image\/([^.[\]\s]+\.(?:png|jpg|jpeg|gif|webp))]/gi;
    const imageNames: string[] = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
        imageNames.push(match[1]);
    }

    return imageNames;
};