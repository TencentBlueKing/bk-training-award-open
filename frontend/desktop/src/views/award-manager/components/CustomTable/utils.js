/**
 * @author couriourc
 * @description 因为在富文本编辑器中需要用纯净的 table ,而不是库的 table
 * @param {array} theadList 用于生成表头，属于表头配置
 * @param {array} selectData 表单数据
 * @param {string} titleKey 表头标题的 key
 * @param {string} propKey 对应标题属性的 key
 * @returns {string} 返回生成的表体
*/
export function getRawTable (theadList = [], selectData = [], titleKey = 'label', propKey = 'prop') {
    console.log(selectData)
    const theadHTML = theadList
        .map((item) => {
            return '<th>' + item[titleKey] + '</th>'
        })
        .join('')
    const getCellInfo = (item) =>
        theadList
            .map((cell) => {
                console.log(item, cell)
                return `<td>${item[cell[propKey]]}</td>`
            })
            .join('')
    const tbodyHTML = selectData
        .map((item) => {
            return `<tr>${getCellInfo(item)}</tr>`
        })
        .join('')
    return (
        '<table border="0" '
        + 'width="100%" '
        + 'cellpadding="0" '
        + 'cellspacing="0" '
        + ' >'
        + '<thead>'
        + '<tr>'
        + theadHTML
        + '</tr>'
        + '</thead>'
        + '<tbody>'
        + (tbodyHTML || '<tr>' + '<td></td>'.repeat(theadList.length) + '</tr>')
        + '</tbody>'
        + '</table>'
    )
}
