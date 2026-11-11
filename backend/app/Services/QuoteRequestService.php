<?php

namespace App\Services;

use App\Models\QuoteRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class QuoteRequestService
{
    /**
     * Create a new quote request from customer.
     */
    public function createQuoteRequest(array $data): QuoteRequest
    {
        return QuoteRequest::create([
            'full_name'           => $data['full_name'],
            'company_name'        => $data['company_name'] ?? null,
            'phone'               => $data['phone'],
            'email'               => $data['email'] ?? null,
            'sku_target'          => $data['sku_target'] ?? null,
            'requirement_content' => $data['requirement_content'] ?? null,
            'source'              => $data['source'] ?? 'landing_form',
            'status'              => 'new',
        ]);
    }

    /**
     * Get paginated quote requests with filtering for admin.
     */
    public function getAdminQuotes(array $filters): LengthAwarePaginator
    {
        $query = QuoteRequest::query();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('sku_target', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get quote request by id for admin.
     */
    public function getAdminQuoteById(int $id): QuoteRequest
    {
        return QuoteRequest::findOrFail($id);
    }

    /**
     * Update quote request status and admin notes.
     */
    public function updateQuoteStatus(int $id, array $data): QuoteRequest
    {
        $quote = QuoteRequest::findOrFail($id);

        $quote->update([
            'status'      => $data['status'],
            'admin_notes' => array_key_exists('admin_notes', $data) ? $data['admin_notes'] : $quote->admin_notes,
        ]);

        return $quote;
    }

    /**
     * Delete a quote request.
     */
    public function deleteQuote(int $id): void
    {
        $quote = QuoteRequest::findOrFail($id);
        $quote->delete();
    }
}
