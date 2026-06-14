import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Funcional - FinControl Server rodando na porta ${PORT}`);
    console.log(`Pressione CTRL+C para parar`);
});
