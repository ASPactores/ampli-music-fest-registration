from math import ceil
from fastapi import Request
from models.schema import PaginationLinks, PaginationMetadata

def build_pagination_links(base_url: str, path: str, page: int, page_size: int, total_pages: int) -> PaginationLinks:
    '''
    Build pagination links for the API response.
    '''
    has_next = page < total_pages
    has_prev = page > 1
    
    url_base = f"{base_url}{path}"
    
    return PaginationLinks(
        first=f"{url_base}?page=1&page_size={page_size}" if total_pages > 0 else None,
        last=f"{url_base}?page={total_pages}&page_size={page_size}" if total_pages > 0 else None,
        next=f"{url_base}?page={page+1}&page_size={page_size}" if has_next else None,
        prev=f"{url_base}?page={page-1}&page_size={page_size}" if has_prev else None,
        self=f"{url_base}?page={page}&page_size={page_size}" if total_pages > 0 else None,
    )


def create_pagination_metadata(request: Request, total_items: int, page: int, page_size: int, path: str) -> PaginationMetadata:
    '''
    Create pagination metadata for the API response.
    '''
    total_pages = ceil(total_items / page_size) if total_items > 0 else 0
    has_next = page < total_pages
    has_prev = page > 1
    
    base_url = f"{request.url.scheme}://{request.url.netloc}"
    links = build_pagination_links(base_url, path, page, page_size, total_pages)
    
    return PaginationMetadata(
        total_items=total_items,
        total_pages=total_pages,
        current_page=page,
        page_size=page_size,
        has_next=has_next,
        has_prev=has_prev,
        next_page=page + 1 if has_next else None,
        prev_page=page - 1 if has_prev else None,
        links=links
    )