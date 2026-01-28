'use client'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  format?: 'text' | 'table'
  table?: {
    columns: string[]
    rows: any[][]
  }
}

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {/* Text Content */}
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Table Content */}
        {message.format === 'table' && message.table && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  {message.table.columns.map((col, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold"
                    >
                      {col.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {message.table.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm"
                      >
                        {cell !== null && cell !== undefined ? cell.toString() : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}