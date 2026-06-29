async function verify() {
  try {
    const response = await fetch("http://localhost:3000/auditoria-test?email=malenasoloads@gmail.com&status=vulnerable");
    console.log("Status Code:", response.status);
    const text = await response.text();
    console.log("Body length:", text.length);
    console.log("Contains RIESGO: MEDIO?", text.includes("RIESGO: MEDIO"));
    console.log("Contains MARGEN OPERATIVO TENSO?", text.includes("MARGEN OPERATIVO TENSO"));
  } catch (error) {
    console.error("Verification failed:", error);
  }
}
verify();
