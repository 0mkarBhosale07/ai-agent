interface JsonViewerProps {
  data: any;
  level?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0 }) => {
  const indent = "  ".repeat(level);

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;
    return (
      <div>
        <span>[</span>
        <div className="pl-4">
          {data.map((item, index) => (
            <div key={index} className="text-gray-300">
              {indent}
              <JsonViewer data={item} level={level + 1} />
              {index < data.length - 1 && (
                <span className="text-gray-500">,</span>
              )}
            </div>
          ))}
        </div>
        <span>{indent}]</span>
      </div>
    );
  }

  if (data === null) {
    return <span className="text-gray-500">null</span>;
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span>{"{}"}</span>;
    return (
      <div>
        <span>{"{"}</span>
        <div className="pl-4">
          {keys.map((key, index) => (
            <div key={key} className="text-gray-300">
              {indent}
              <span className="text-blue-400">"{key}"</span>
              <span className="text-gray-500">: </span>
              <JsonViewer data={data[key]} level={level + 1} />
              {index < keys.length - 1 && (
                <span className="text-gray-500">,</span>
              )}
            </div>
          ))}
        </div>
        <span>
          {indent}
          {"}"}
        </span>
      </div>
    );
  }

  if (typeof data === "string") {
    return <span className="text-green-400">"{data}"</span>;
  }

  if (typeof data === "number") {
    return <span className="text-yellow-400">{data}</span>;
  }

  if (typeof data === "boolean") {
    return <span className="text-purple-400">{data.toString()}</span>;
  }

  return <span>{String(data)}</span>;
};

export default JsonViewer;
