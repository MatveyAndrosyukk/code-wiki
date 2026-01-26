export default function extractImagesName (content: string): string[] {
    const imageRegex = /\[image\/(.+?)]/g;
    const imageNames: string[] = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
        imageNames.push(match[1].split(':')[1]);
    }

    return imageNames;
};