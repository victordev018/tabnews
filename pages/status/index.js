import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function Status() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h3>Banco de dados:</h3>
      <DatabaseStatusInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatusInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let isLoadingMessage = "Carregando...";
  let maxConnectionsText = isLoadingMessage;
  let oppenedConnectionsText = isLoadingMessage;
  let versionText = isLoadingMessage;

  if (!isLoading && data) {
    maxConnectionsText = data.dependencies.database.max_connections;
    oppenedConnectionsText = data.dependencies.database.opened_connections;
    versionText = data.dependencies.database.version;
  }

  return (
    <>
      <div>Máximo de conexões: {maxConnectionsText}</div>
      <div>Conexões abertas: {oppenedConnectionsText}</div>
      <div>versão Postgres: {versionText}</div>
    </>
  );
}
