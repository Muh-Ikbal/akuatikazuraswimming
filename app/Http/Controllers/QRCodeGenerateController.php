<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Label\LabelAlignment;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Str;
use App\Models\QrCodeGenerate;



class QRCodeGenerateController extends Controller
{
    public function index(){
        try {
            $user = auth()->user();
            $qr_code = QrCodeGenerate::where('user_id', $user->id)->first();
            return Inertia::render('qr-code',[
                'qr_code' => $qr_code
            ]);
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
    }

    public function generateQRCode(){
        try {
            $user = auth()->user();
            $uuid = Str::uuid();

            $qr_code = QrCodeGenerate::where('user_id', $user->id)->first();
            $directory = public_path('qr_codes');
            if (!is_dir($directory)) {
                mkdir($directory, 0777, true);
            }

            if($qr_code){
                return redirect()->back()->with('error', 'QR Code sudah ada');
            }

            $qr_code_path = 'qr_codes/' . $uuid . '.png';

        
            $builder = new Builder(
                writer: new PngWriter(),
                writerOptions: [],
                validateResult: false,
                data: $uuid,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::High,
                size: 400,
                margin: 10,
                roundBlockSizeMode: RoundBlockSizeMode::Margin,
                logoPath: public_path('logo.png'),
                logoResizeToWidth: 100,
                logoPunchoutBackground: true,
                // REMOVE LABEL FROM BUILDER to avoid FreeType dependency
                // labelText: $user->name,
                // labelFont: new OpenSans(20),
                // labelAlignment: LabelAlignment::Center
            );

            $result = $builder->build();

            // Manual Label Rendering Workaround (No FreeType required)
            try {
                // Load the generated QR code from string
                $qrImage = imagecreatefromstring($result->getString());
                if ($qrImage === false) {
                        throw new \Exception("Failed to load QR code image.");
                }
                
                $qrWidth = imagesx($qrImage);
                $qrHeight = imagesy($qrImage);
                
                // Define label area
                $labelHeight = 50; 
                $finalHeight = $qrHeight + $labelHeight;
                
                // Create a new true color image
                $finalImage = imagecreatetruecolor($qrWidth, $finalHeight);
                
                // Set background color (white)
                $white = imagecolorallocate($finalImage, 255, 255, 255);
                $black = imagecolorallocate($finalImage, 0, 0, 0);
                
                // Fill background
                imagefilledrectangle($finalImage, 0, 0, $qrWidth, $finalHeight, $white);
                
                // Copy QR code onto new image
                imagecopy($finalImage, $qrImage, 0, 0, 0, 0, $qrWidth, $qrHeight);
                
                // Add text using built-in font (Font 5 is the largest built-in font)
                $text = $user->name;
                $font = 5;
                $fontWidth = imagefontwidth($font);
                $fontHeight = imagefontheight($font);
                
                // Calculate center position
                $textWidth = strlen($text) * $fontWidth;
                $x = ($qrWidth - $textWidth) / 2;
                $y = $qrHeight + (($labelHeight - $fontHeight) / 2);
                
                // Write text
                imagestring($finalImage, $font, (int)$x, (int)$y, $text, $black);
                
                // Save final image
                imagepng($finalImage, public_path($qr_code_path));
                
                // Cleanup
                imagedestroy($qrImage);
                imagedestroy($finalImage);
                
            } catch (\Throwable $e) {
                // Fallback: Just save the original QR code without label if manual manipulation fails
                $result->saveToFile(public_path($qr_code_path));
            }

            QrCodeGenerate::create([
                'qr_code' => $uuid,
                'qr_code_path' => $qr_code_path,
                'user_id' => $user->id
            ]);

            return redirect()->back()->with('success', 'QR Code berhasil dibuat');
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $th->getMessage());
        }
        
    }
}
