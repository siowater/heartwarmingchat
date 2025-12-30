import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 - 優しさの交換サイト',
  description: '優しさの交換サイトの利用規約',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="rounded-3xl bg-white p-6 md:p-10 shadow-soft">
        <h1 className="mb-8 text-3xl md:text-4xl font-bold text-warm-800">利用規約</h1>
        
        <div className="prose prose-lg max-w-none text-warm-700 space-y-6">
          <p className="text-sm text-warm-500">
            最終更新日: 2024年12月30日
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」といいます。）は、優しさの交換サイト（以下「本サービス」といいます。）の利用条件を定めるものです。
              登録ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第2条（利用登録）</h2>
            <p>
              本サービスの利用を希望する方は、本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p>
              ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
              ユーザーIDまたはパスワードが第三者に使用されたことによって生じた損害は、当社に故意または重大な過失がある場合を除き、当社は一切の責任を負わないものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第4条（利用料金および支払方法）</h2>
            <p>
              本サービスは、無料でご利用いただけます。ただし、将来有料化する可能性があることをご了承ください。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第5条（禁止事項）</h2>
            <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスによって得られた情報を商業的に利用する行為</li>
              <li>当社のサービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正な目的を持って本サービスを利用する行為</li>
              <li>本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
              <li>面識のない異性との出会いを目的とした行為</li>
              <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第6条（本サービスの提供の停止等）</h2>
            <p>
              当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mt-4">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当社が本サービスの提供が困難と判断した場合</li>
            </ol>
            <p className="mt-4">
              当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第7条（保証の否認および免責）</h2>
            <p>
              当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </p>
            <p className="mt-4">
              当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第8条（サービス内容の変更等）</h2>
            <p>
              当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第9条（利用規約の変更）</h2>
            <p>
              当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第10条（個人情報の取扱い）</h2>
            <p>
              当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第11条（通知または連絡）</h2>
            <p>
              ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第12条（権利義務の譲渡の禁止）</h2>
            <p>
              ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-warm-800 mb-4">第13条（準拠法・裁判管轄）</h2>
            <p>
              本規約の解釈にあたっては、日本法を準拠法とします。
              本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-warm-200">
            <p className="text-sm text-warm-500">
              以上
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

