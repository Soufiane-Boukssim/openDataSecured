package com.soufiane.open_data.repositories;

import com.soufiane.open_data.entities.DataProviderOrganisationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DataProviderOrganisationMemberRepository extends JpaRepository<DataProviderOrganisationMember, Long> {
    List<DataProviderOrganisationMember> findByDeletedFalse();
    DataProviderOrganisationMember findByUuidAndDeletedFalse(UUID uuid);
    DataProviderOrganisationMember findByFirstNameAndLastNameAndDeletedFalse(String firstName, String lastName);
    DataProviderOrganisationMember findByEmailAndDeletedFalse(String email);

    List<DataProviderOrganisationMember> findByDataProviderOrganisation_UuidAndDeletedFalse(UUID organisationUuid);
}
