-- Donation Statistics Function
-- Creates a function to get donation statistics for different time periods

CREATE OR REPLACE FUNCTION get_donation_statistics(
    period_type TEXT DEFAULT 'month'
)
RETURNS JSON AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
    end_date TIMESTAMP WITH TIME ZONE := NOW();
    result JSON;
    total_amount DECIMAL := 0;
    total_count INT := 0;
    successful_count INT := 0;
    failed_count INT := 0;
    pending_count INT := 0;
    average_amount DECIMAL := 0;
    top_payment_method TEXT := 'credit_card';
BEGIN
    -- Calculate start date based on period
    CASE period_type
        WHEN 'day' THEN start_date := NOW() - INTERVAL '1 day';
        WHEN 'week' THEN start_date := NOW() - INTERVAL '1 week';
        WHEN 'month' THEN start_date := NOW() - INTERVAL '1 month';
        WHEN 'year' THEN start_date := NOW() - INTERVAL '1 year';
        ELSE start_date := NOW() - INTERVAL '1 month';
    END CASE;

    -- Get total amount and count
    SELECT 
        COALESCE(SUM(amount), 0),
        COUNT(*)
    INTO total_amount, total_count
    FROM donations 
    WHERE created_at BETWEEN start_date AND end_date;

    -- Get status counts
    SELECT 
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'failed'),
        COUNT(*) FILTER (WHERE status IN ('pending', 'processing'))
    INTO successful_count, failed_count, pending_count
    FROM donations 
    WHERE created_at BETWEEN start_date AND end_date;

    -- Calculate average amount
    IF total_count > 0 THEN
        average_amount := total_amount / total_count;
    END IF;

    -- Get top payment method
    SELECT payment_method
    INTO top_payment_method
    FROM donations 
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY payment_method
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Build result JSON
    SELECT json_build_object(
        'total_amount', total_amount,
        'total_count', total_count,
        'successful_count', successful_count,
        'failed_count', failed_count,
        'pending_count', pending_count,
        'average_amount', average_amount,
        'top_payment_method', COALESCE(top_payment_method, 'credit_card'),
        'period', period_type,
        'start_date', start_date,
        'end_date', end_date,
        'success_rate', CASE 
            WHEN total_count > 0 THEN (successful_count::DECIMAL / total_count::DECIMAL) * 100 
            ELSE 0 
        END
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get donation trends
CREATE OR REPLACE FUNCTION get_donation_trends(
    days_back INT DEFAULT 30
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH daily_stats AS (
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as count,
            SUM(amount) as total,
            COUNT(*) FILTER (WHERE status = 'completed') as successful,
            COUNT(*) FILTER (WHERE status = 'failed') as failed
        FROM donations 
        WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL
        GROUP BY DATE(created_at)
        ORDER BY date
    )
    SELECT json_agg(
        json_build_object(
            'date', date,
            'count', count,
            'total', total,
            'successful', successful,
            'failed', failed
        )
    ) INTO result
    FROM daily_stats;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get payment method distribution
CREATE OR REPLACE FUNCTION get_payment_method_distribution(
    period_type TEXT DEFAULT 'month'
)
RETURNS JSON AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
    result JSON;
BEGIN
    -- Calculate start date
    CASE period_type
        WHEN 'day' THEN start_date := NOW() - INTERVAL '1 day';
        WHEN 'week' THEN start_date := NOW() - INTERVAL '1 week';
        WHEN 'month' THEN start_date := NOW() - INTERVAL '1 month';
        WHEN 'year' THEN start_date := NOW() - INTERVAL '1 year';
        ELSE start_date := NOW() - INTERVAL '1 month';
    END CASE;

    SELECT json_agg(
        json_build_object(
            'payment_method', payment_method,
            'count', count,
            'total_amount', total_amount,
            'percentage', ROUND((count::DECIMAL / SUM(count) OVER()) * 100, 2)
        )
    ) INTO result
    FROM (
        SELECT 
            COALESCE(payment_method, 'unknown') as payment_method,
            COUNT(*) as count,
            SUM(amount) as total_amount
        FROM donations 
        WHERE created_at BETWEEN start_date AND NOW()
        GROUP BY payment_method
    ) stats;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get donor insights
CREATE OR REPLACE FUNCTION get_donor_insights(
    period_type TEXT DEFAULT 'month'
)
RETURNS JSON AS $$
DECLARE
    start_date TIMESTAMP WITH TIME ZONE;
    result JSON;
BEGIN
    -- Calculate start date
    CASE period_type
        WHEN 'day' THEN start_date := NOW() - INTERVAL '1 day';
        WHEN 'week' THEN start_date := NOW() - INTERVAL '1 week';
        WHEN 'month' THEN start_date := NOW() - INTERVAL '1 month';
        WHEN 'year' THEN start_date := NOW() - INTERVAL '1 year';
        ELSE start_date := NOW() - INTERVAL '1 month';
    END CASE;

    WITH donor_stats AS (
        SELECT 
            donor_email,
            donor_name,
            COUNT(*) as donation_count,
            SUM(amount) as total_amount,
            AVG(amount) as avg_amount,
            MAX(created_at) as last_donation,
            MIN(created_at) as first_donation
        FROM donations 
        WHERE created_at BETWEEN start_date AND NOW()
          AND donor_email IS NOT NULL
        GROUP BY donor_email, donor_name
    )
    SELECT json_build_object(
        'total_donors', COUNT(*),
        'new_donors', COUNT(*) FILTER (WHERE first_donation >= start_date),
        'repeat_donors', COUNT(*) FILTER (WHERE donation_count > 1),
        'top_donors', (
            SELECT json_agg(
                json_build_object(
                    'name', donor_name,
                    'email', donor_email,
                    'total_amount', total_amount,
                    'donation_count', donation_count
                )
            ) 
            FROM (
                SELECT * FROM donor_stats 
                ORDER BY total_amount DESC 
                LIMIT 10
            ) top_10
        ),
        'avg_donation_per_donor', COALESCE(AVG(avg_amount), 0),
        'repeat_donor_rate', CASE 
            WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE donation_count > 1)::DECIMAL / COUNT(*)::DECIMAL) * 100 
            ELSE 0 
        END
    ) INTO result
    FROM donor_stats;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
