const BillingVerification = artifacts.require('BillingVerification');
const RecordsStorage = artifacts.require('RecordsStorage');
const DoctorVerification = artifacts.require('DoctorVerification');
const EmergencyAccess = artifacts.require('EmergencyAccess');

module.exports = async function (deployer) {
    await deployer.deploy(BillingVerification);
    await deployer.deploy(RecordsStorage);
    await deployer.deploy(DoctorVerification);
    await deployer.deploy(EmergencyAccess);
};