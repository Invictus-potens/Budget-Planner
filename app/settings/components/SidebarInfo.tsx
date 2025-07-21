import { Card } from './Card';

export function SidebarInfo() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="text-lg font-semibold text-grayDark mb-2">Estatísticas</h2>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between"><span>Usuários:</span> <span className="text-blue font-bold">0</span></div>
          <div className="flex justify-between"><span>Salários:</span> <span className="text-green font-bold">0</span></div>
          <div className="flex justify-between"><span>Transações:</span> <span className="text-red font-bold">0</span></div>
          <div className="flex justify-between"><span>Orçamentos:</span> <span className="text-blue font-bold">0</span></div>
          <div className="flex justify-between"><span>Metas:</span> <span className="text-green font-bold">0</span></div>
          <div className="flex justify-between"><span>Categorias:</span> <span className="text-grayDark font-bold">10</span></div>
        </div>
      </Card>
      <Card className="bg-pastelPink">
        <h2 className="text-lg font-semibold text-magenta mb-2">Dicas de Lembretes</h2>
        <ul className="list-disc pl-5 text-grayMedium">
          <li><span className="text-green">•</span> Defina lembretes para vencimento de contas importantes</li>
          <li><span className="text-orange">•</span> Configure lembretes recorrentes para pagamentos mensais</li>
          <li><span className="text-green">•</span> Use lembretes para suas metas financeiras mensais</li>
          <li><span className="text-orange">•</span> Lembre-se de revisar seus investimentos mensalmente</li>
          <li><span className="text-green">•</span> Configure alertas para datas de recebimento de salário</li>
          <li><span className="text-orange">•</span> Crie lembretes para revisão de orçamentos</li>
        </ul>
      </Card>
    </div>
  );
} 