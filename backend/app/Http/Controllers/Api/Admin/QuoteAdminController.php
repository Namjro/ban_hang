<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quote\QuoteFilterRequest;
use App\Http\Requests\Quote\UpdateQuoteStatusRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Services\QuoteRequestService;
use Illuminate\Http\JsonResponse;

class QuoteAdminController extends Controller
{
    public function __construct(
        protected QuoteRequestService $quoteService
    ) {}

    public function index(QuoteFilterRequest $request): JsonResponse
    {
        $quotes = $this->quoteService->getAdminQuotes($request->validated());

        return response()->json([
            'success'    => true,
            'data'       => QuoteRequestResource::collection($quotes->items()),
            'pagination' => [
                'total'        => $quotes->total(),
                'per_page'     => $quotes->perPage(),
                'current_page' => $quotes->currentPage(),
                'last_page'    => $quotes->lastPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $quote = $this->quoteService->getAdminQuoteById($id);

        return response()->json([
            'success' => true,
            'data'    => new QuoteRequestResource($quote),
        ]);
    }

    public function updateStatus(UpdateQuoteStatusRequest $request, int $id): JsonResponse
    {
        $quote = $this->quoteService->updateQuoteStatus($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái yêu cầu báo giá thành công.',
            'data'    => new QuoteRequestResource($quote),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->quoteService->deleteQuote($id);

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa yêu cầu báo giá.',
        ]);
    }
}
