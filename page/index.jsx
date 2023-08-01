const requestApi = (url, queryParams, data, method = 'GET') => {
  let reqUrl = url;
  const reqOptions = {
    method
  };
  if (queryParams) {
    const queryStr = Object.keys(queryParams).map((key) => `${key}=${queryParams[key]}`).join('&');
    if (queryStr) {
      reqUrl += `?${queryStr}`;
    }
  }
  if (data) {
    reqOptions.headers = {
      'Content-Type': 'application/json'
    };
    reqOptions.body = JSON.stringify(data);
  }
  return fetch(reqUrl, reqOptions)
    .then((res) => res.json())
    .then((result) => {
      if (!result || !result.success) {
        throw new Error(result && result.errMsg);
      }
      return result.data;
    })
    .catch((err) => {
      window.alert(err.message);
    });
};

const APP = () => {
  const [todoList,setTodoList] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/getTodoList.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("调用接口", data);
        setTodoList(data);
      });
      
  }, []);
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address",
    },
  ];

  const handleClick = () => {
    fetch("/api/addTodoItem.json", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ id: Math.random(), name: "添加" }),
    })
      .then((response) => response.json())
      .then((data) => console.log("调用接口", data));
  };

  return (
    <div>
      <a onClick={handleClick}>添加数据</a>
      <div>
        {JSON.stringify(todoList)}
      </div>
      <ul>
        {columns.map((it) => {
          return (
            <li key={it.key}>
              <span>{it.title}</span>
              <span>{it.dataIndex}</span>
              <span>编辑</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ReactDOM.render(<APP />, document.getElementById("root"));
