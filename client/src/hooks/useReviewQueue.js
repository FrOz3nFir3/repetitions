import { useState, useEffect, useRef, useCallback } from "react";
import { useGetReviewQueueItemsQuery } from "../api/apiSlice";

const useReviewQueue = (cardId, isOpen) => {
    const [page, setPage] = useState(1);

    const { data, isFetching, isError } = useGetReviewQueueItemsQuery(
        { cardId, page },
        {
            skip: !isOpen || !cardId,
        }
    );

    const observer = useRef();
    const lastItemElementRef = useCallback(
        (node) => {
            if (isFetching) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && data?.hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetching, data?.hasMore]
    );

    // Reset state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setPage(1);
        }
    }, [isOpen]);

    return {
        items: data?.items || [],
        isFetching,
        isError,
        lastItemElementRef,
    };
};

export default useReviewQueue;