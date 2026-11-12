<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class MediaService
{
    public const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    public const DOCUMENT_EXTENSIONS = ['pdf'];
    public const FOLDERS = ['products', 'categories', 'site', 'datasheets'];

    /**
     * Store image files into public/uploads/{folder} and return their absolute URLs.
     *
     * @param array<UploadedFile> $files
     * @return array<string>
     */
    public function storeImages(array $files, string $schemeAndHttpHost, string $folder = 'products'): array
    {
        return $this->storeFiles($files, $schemeAndHttpHost, $folder, self::IMAGE_EXTENSIONS);
    }

    /**
     * Store a single PDF document and return its absolute URL (or null when rejected).
     */
    public function storeDocument(UploadedFile $file, string $schemeAndHttpHost, string $folder = 'datasheets'): ?string
    {
        $urls = $this->storeFiles([$file], $schemeAndHttpHost, $folder, self::DOCUMENT_EXTENSIONS);

        return $urls[0] ?? null;
    }

    /**
     * @param array<UploadedFile> $files
     * @param array<string> $allowedExtensions
     * @return array<string>
     */
    private function storeFiles(array $files, string $schemeAndHttpHost, string $folder, array $allowedExtensions): array
    {
        $folder = in_array($folder, self::FOLDERS, true) ? $folder : 'products';
        $targetDir = public_path('uploads' . DIRECTORY_SEPARATOR . $folder);
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $uploadedUrls = [];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowedExtensions, true)) {
                continue;
            }

            $filename = 'axiom_' . time() . '_' . Str::random(8) . '.' . $extension;
            $destinationPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

            if (@copy($file->getRealPath(), $destinationPath) || @file_put_contents($destinationPath, file_get_contents($file->getRealPath()))) {
                $uploadedUrls[] = $schemeAndHttpHost . '/uploads/' . $folder . '/' . $filename;
            }
        }

        return $uploadedUrls;
    }
}
