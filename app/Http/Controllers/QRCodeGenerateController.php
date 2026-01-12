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
        $user = auth()->user();
        $qr_code = QrCodeGenerate::where('user_id', $user->id)->first();
        return Inertia::render('qr-code',[
            'qr_code' => $qr_code
        ]);
    }

    public function generateQRCode(){
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
            labelText: $user->name,
            labelFont: new OpenSans(20),
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();


        $result->saveToFile(public_path($qr_code_path));

        QrCodeGenerate::create([
            'qr_code' => $uuid,
            'qr_code_path' => $qr_code_path,
            'user_id' => $user->id
        ]);

        return redirect()->back()->with('success', 'QR Code berhasil dibuat');
        
    }
}
