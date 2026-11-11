<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quote\StoreQuoteRequest;
use App\Services\QuoteRequestService;
use Illuminate\Http\JsonResponse;

class QuoteRequestController extends Controller
{
    public function __construct(
        protected QuoteRequestService $quoteService
    ) {}

    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $quote = $this->quoteService->createQuoteRequest($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn quý khách! Kỹ sư phụ trách của AXIOM sẽ liên hệ và gửi báo giá chi tiết trong vòng 2 giờ làm việc.',
            'data'    => [
                'id'         => $quote->id,
                'status'     => $quote->status,
                'created_at' => $quote->created_at,
            ],
        ], 201);
    }
}
