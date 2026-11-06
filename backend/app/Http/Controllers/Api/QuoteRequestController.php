<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuoteRequestController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'sku_target' => 'nullable|string|max:255',
            'requirement_content' => 'nullable|string|max:2000',
            'source' => 'nullable|string|in:landing_form,contact_modal',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng kiểm tra lại thông tin gửi yêu cầu.',
                'errors' => $validator->errors()
            ], 422);
        }

        $quote = QuoteRequest::create([
            'full_name' => $request->input('full_name'),
            'company_name' => $request->input('company_name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'sku_target' => $request->input('sku_target'),
            'requirement_content' => $request->input('requirement_content'),
            'source' => $request->input('source', 'landing_form'),
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn quý khách! Kỹ sư phụ trách của AXIOM sẽ liên hệ và gửi báo giá chi tiết trong vòng 2 giờ làm việc.',
            'data' => [
                'id' => $quote->id,
                'status' => $quote->status,
                'created_at' => $quote->created_at,
            ]
        ], 201);
    }
}
