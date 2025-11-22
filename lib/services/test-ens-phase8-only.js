import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createENSSubname } from './ens';
async function testPhase8() {
    console.log('\n🧪 Testing Phase 8️⃣: Create Subname via NameWrapper\n');
    try {
        const parentNode = process.env.ENS_PARENT_NODE;
        if (!parentNode) {
            throw new Error('ENS_PARENT_NODE not set');
        }
        const subnameLabel = 'EROS005';
        console.log(`Testing with:`);
        console.log(`  Parent Node: ${parentNode}`);
        console.log(`  Label: ${subnameLabel}\n`);
        const txHash = await createENSSubname(subnameLabel, parentNode);
        console.log(`\n✅ SUCCESS!`);
        console.log(`   Tx: ${txHash}\n`);
    }
    catch (error) {
        console.error('\n❌ FAILED');
        console.error(error);
        process.exit(1);
    }
}
testPhase8();
