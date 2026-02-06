export const inlineStylesForPrint = {
    content_area: {
        marginBottom: '55px'
    },
    p: {
        marginBottom: '1rem',
        marginTop: 0
    },
    p_divider: {
        marginBottom: '1rem',
        marginTop: 0,
        breakBefore: 'page'
    },
    table: {
        borderCollapse: "collapse",
        backgroundColor: 'transparent',
        marginBottom: '1rem',
        width: '100%'
    },
    table_bordered: {
        borderCollapse: 'collapse',
        backgroundColor: 'transparent',
        marginBottom: '1rem',
        width: '100%',
        border:0
    },
    table_responsive: {
        display:'block', 
        overflowX:'auto', 
        width:'100%'
    },
    th: {
        textAlign:'inherit',
        borderTop:'1px solid #c8ced3', 
        padding:'0.75rem', 
        verticalAlign:'bottom', 
        borderBottom:'2px solid #c8ced3'
    },
    tr_filled: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
        fontWeight: '700'
    },
    td_bordered: {
        borderTop: '1px solid #c8ced3',
        padding: '0.75rem',
        verticalAlign: 'top'
    }
}